/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

interface CKEditorProps {
  data: string
  onChange: (event: any, editor: any) => void
}

export default function CKEditorComponent({ data, onChange }: CKEditorProps) {
  const [editorLoaded, setEditorLoaded] = useState(false)

  useEffect(() => {
    // Only set editor as loaded on the client side
    setEditorLoaded(true)
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
        config={{
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            'undo',
            'redo'
          ]
        }}
      />
    </div>
  )
}