"use client"

import { useEffect, useState } from "react"
import { CKEditor } from "@ckeditor/ckeditor5-react"

interface CKEditorComponentProps {
  initialData?: string
  onChange?: (data: string) => void
}

export function CKEditorComponent({ initialData = "<p>Hello world!</p>", onChange }: CKEditorComponentProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editor, setEditor] = useState<any>(null)

  useEffect(() => {
    // Import the CKEditor build properly
    const loadEditor = async () => {
      try {
        // Import the module correctly
        const ClassicEditorModule = await import("@ckeditor/ckeditor5-build-classic")
        // Store the default export which is the editor constructor
        setEditor(ClassicEditorModule.default)
      } catch (error) {
        console.error("Error loading CKEditor:", error)
      }
    }

    loadEditor()
  }, [])

  // Don't render the editor until it's loaded
  if (!editor) {
    return <div className="border rounded-md p-4 min-h-[200px] bg-gray-50">Loading editor...</div>
  }

  return (
    <div className="ckeditor-container">
      <CKEditor
        editor={editor} // Pass the editor class directly, not an instance
        data={initialData}
        config={{
          licenseKey: process.env.NEXT_PUBLIC_CKEDITOR_LICENSE_KEY || "",
          toolbar: [
            "undo",
            "redo",
            "|",
            "heading",   
            "|",
            "bold",
            "italic",
            "|",
            "link",
            "insertTable",
            "|",
            "bulletedList",
            "numberedList",
          ],
        }}
        onReady={(editor) => {
          console.log("CKEditor is ready to use!", editor)
        }}
        onChange={(event, editor) => {
          const data = editor.getData()
          onChange?.(data)
        }}
      />
      <style jsx global>{`
        .ck-editor__editable {
          min-height: 200px;
          max-height: 500px;
        }
        .ck.ck-editor {
          width: 100%;
        }
      `}</style>
    </div>
  )
}
