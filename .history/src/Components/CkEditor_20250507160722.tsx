/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"

interface CKEditorProps {
  data: string
  onChange: (data: string) => void
}

export default function CKEditorComponent({ data, onChange }: CKEditorProps) {
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
      <textarea
        value={data}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Call to Action Content"
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    )
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <CKEditor
        editor={ClassicEditor}
        data={data}
        onChange={(event: any, editor: any) => {
          const data = editor.getData()
          onChange(data)
        }}
      />
    </div>
  )
}
