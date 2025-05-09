/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

interface CKEditorProps {
  data: string;
  onChange: (event: any, editor: any) => void;
}

export default function CKEditorComponent({ data, onChange }: CKEditorProps) {
  const [CKEditor, setCKEditor] = useState<any>(null);
  const [ClassicEditor, setClassicEditor] = useState<any>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    // Only import CKEditor libraries on the client side
    // This prevents the "window is not defined" error
    const loadEditor = async () => {
      try {
        // Dynamic imports inside useEffect to ensure client-side only
        const CKEditorModule = await import("@ckeditor/ckeditor5-react");
        const ClassicEditorModule = await import("@ckeditor/ckeditor5-build-classic");
        
        setCKEditor(CKEditorModule.CKEditor);
        setClassicEditor(ClassicEditorModule.default);
        setEditorLoaded(true);
      } catch (error) {
        console.error("Error loading CKEditor:", error);
      }
    };
    
    loadEditor();
  }, []);

  if (!editorLoaded || !CKEditor || !ClassicEditor) {
    return (
      <div className="border border-gray-300 rounded-md p-4 h-64 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
        <p>Loading editor...</p>
      </div>
    );
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
            'undo',
            'redo'
          ]
        }}
      />
    </div>
  );
}