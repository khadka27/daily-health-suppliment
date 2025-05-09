/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"

interface CKEditorProps {
  data: string
  onChange: (event: any, editor: any) => void
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
      <div className="border border-gray-300 rounded-md p-4 flex items-center justify-center h-64">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
        <p>Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <CKEditor
        editor={ClassicEditor}
        data={data}
        onChange={onChange}
      />
    </div>
  )
}