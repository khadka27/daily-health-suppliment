"use client"

import type React from "react"
import type { FormEvent } from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { BlockEditor } from "@/components/block-editor/block-editor"
import type { Article, Block } from "@/types/article"
import Image from "next/image"
import type { JSX } from "react"

interface EditArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const router = useRouter();

  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [originalSlug, setOriginalSlug] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const { id } = await params;
        const res = await fetch(`/api/articles/${id}`);

        setId(id);

        if (!res.ok) throw new Error("Failed to fetch article");

        const article: Article = await res.json();

        setTitle(article.title);
        setAuthor(article.author);
        setImageUrl(article.imageUrl || "");
        setBlocks(article.blocks || []);
        setOriginalSlug(article.slug);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load article",
          variant: "destructive",
        });
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [params, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !author || !blocks.length) {
      toast({ title: "Validation Error", description: "Please complete all fields.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const newSlug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
      const { id } = await params;

      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: newSlug,
          author,
          imageUrl: imageUrl || null,
          blocks: blocks.map((block, index) => ({ ...block, order: index })),
        }),
      });

      if (!res.ok) throw new Error((await res.json()).message || "Update failed");

      const updatedArticle: Article = await res.json();

      toast({ title: "Success", description: "Article updated successfully." });
      router.push(`/articles/${updatedArticle.slug}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const { id } = await params;
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error((await res.json()).message || "Deletion failed");

      toast({ title: "Success", description: "Article deleted successfully." });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center\">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Article</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {isPreview ? (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="max-w-4xl mx-auto">
              {imageUrl && (
                <div className="mb-6">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={title}
                    width={800}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}

              <h1 className="text-4xl font-bold mb-4 text-center">{title}</h1>

              <div className="text-center text-gray-600 mb-8">
                By {author} • {new Date().toLocaleDateString()}
              </div>

              <div className="prose prose-lg max-w-none">
                {blocks.map((block) => {
                  switch (block.type) {
                    case "heading":
                      const HeadingTag = `h${Math.min(block.level || 2, 6)}` as keyof JSX.IntrinsicElements
                      return (
                        <HeadingTag
                          key={block.id}
                          className={`font-bold text-blue-600 mb-4 ${
                            block.level === 1 ? "text-3xl" : block.level === 2 ? "text-2xl" : "text-xl"
                          }`}
                        >
                          {block.content}
                        </HeadingTag>
                      )
                    case "paragraph":
                      return (
                        <div
                          key={block.id}
                          className="text-gray-700 mb-4 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: block.content || "" }}
                        />
                      )
                    case "image":
                      return (
                        <div key={block.id} className="mb-6">
                          {block.imageUrl && (
                            <Image
                              src={block.imageUrl || "/placeholder.svg"}
                              alt={block.content || "Image"}
                              width={600}
                              height={400}
                              className="w-full h-auto rounded-md"
                            />
                          )}
                          {block.content && <p className="text-center text-gray-600 text-sm mt-2">{block.content}</p>}
                        </div>
                      )
                    default:
                      return (
                        <div key={block.id} className="mb-4">
                          <div dangerouslySetInnerHTML={{ __html: block.content || "" }} />
                        </div>
                      )
                  }
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Featured Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL (optional)"
              />
              {imageUrl && (
                <div className="mt-2 w-full max-w-md">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt="Featured image preview"
                    width={400}
                    height={200}
                    className="w-full h-auto rounded-md border"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=200&width=400"
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Content *</Label>
              <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm">
                <p className="font-medium text-blue-800">Article Editor Tips:</p>
                <ul className="list-disc pl-5 mt-2 text-blue-700 space-y-1">
                  <li>Use the + buttons to add new content blocks</li>
                  <li>Drag blocks to reorder them</li>
                  <li>Use different block types for headings, paragraphs, images, and special content</li>
                  <li>Product-specific blocks include ratings, pros/cons, and ingredient lists</li>
                </ul>
              </div>
              <BlockEditor blocks={blocks} onChange={setBlocks} articleId={id} />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Article"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={`/articles/${originalSlug}`}>Cancel</Link>
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} className="ml-auto">
              Delete Article
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
