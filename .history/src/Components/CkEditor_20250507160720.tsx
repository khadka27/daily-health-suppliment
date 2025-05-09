/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CKEditorComponentProps {
  initialData?: string;
  onChange?: (data: string) => void;
}

export function CKEditorComponent({ initialData = "<p>Hello world!</p>", onChange }: CKEditorComponentProps) {
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    // The editor is imported directly for this example as it's already being imported at the top
    setEditor(ClassicEditor);
  }, []);

  // Don't render the editor until it's loaded
  if (!editor) {
    return <div className="border rounded-md p-4 min-h-[200px] bg-gray-50">Loading editor...</div>;
  }

  return (
    <div className="ckeditor-container">
      <CKEditor
        editor={editor} // Pass the editor class directly
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
          console.log("CKEditor is ready to use!", editor);
        }}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          onChange?.(data); // Pass the data to the parent component's onChange handler
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
  );
}
