"use client"

import { useEffect, useState } from "react"

interface CKEditorFullComponentProps {
  data: string
  onChange: (data: string) => void
}

export default function CKEditorFullComponent({ data, onChange }: CKEditorFullComponentProps) {
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [CKEditor, setCKEditor] = useState<any>(null)
  const [ClassicEditor, setClassicEditor] = useState<any>(null)

  useEffect(() => {
    // Only import CKEditor on the client side
    if (typeof window !== "undefined") {
      Promise.all([
        import("@ckeditor/ckeditor5-react").then(({ CKEditor }) => setCKEditor(() => CKEditor)),
        import("@ckeditor/ckeditor5-build-classic").then((ClassicEditor) =>
          setClassicEditor(() => ClassicEditor.default),
        ),
      ]).then(() => {
        setEditorLoaded(true)
      })
    }
  }, [])

  if (!editorLoaded) {
    return (
      <div className="border border-gray-300 rounded-md p-4 h-96 flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading editor...</div>
      </div>
    )
  }

  // Custom editor configuration
  const editorConfig = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "outdent",
      "indent",
      "|",
      "imageUpload",
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "undo",
      "redo",
    ],
    heading: {
      options: [
        { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
        { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
        { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
        { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
        { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
      ],
    },
    image: {
      toolbar: ["imageTextAlternative", "imageStyle:full", "imageStyle:side"],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    // This is where you would configure image upload in a real application
    // For example, using the CKFinder or a custom upload adapter
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <CKEditor
        editor={ClassicEditor}
        data={data}
        config={editorConfig}
        onChange={(event: any, editor: any) => {
          const data = editor.getData()
          onChange(data)
        }}
        onReady={(editor: any) => {
          // You can customize the editor further here
          editor.editing.view.change((writer: any) => {
            writer.setStyle("min-height", "500px", editor.editing.view.document.getRoot())
          })
        }}
      />
    </div>
  )
}
