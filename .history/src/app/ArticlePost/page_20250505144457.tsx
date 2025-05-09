import { EditorForm } from "@/Components/EditorForm"

export default function PostArticle() {
  return (
    <div className="container py-8 px-4 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Article</h1>
      <EditorForm />
    </div>
  )
}
