"use client";

import { useEffect, useState } from "react";

interface CKEditorProps {
  data: string;
  onChange: (event: any, editor: any) => void;
}

export default function CKEditorComponent({ data, onChange }: CKEditorProps) {
  // State to store editor components
  const [Editor, setEditor] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamic imports only on client-side
    const loadEditor = async () => {
      try {
        // Import the required modules
        const { CKEditor } = await import('@ckeditor/ckeditor5-react');
        const ClassicEditorModule = await import('@ckeditor/ckeditor5-build-classic');
        
        // Store the editor component in state
        setEditor({
          CKEditor,
          ClassicEditor: ClassicEditorModule.default
        });
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading CKEditor:", error);
      }
    };
    
    loadEditor();
  }, []);

  // Show loading state until editor is ready
  if (!isLoaded || !Editor) {
    return (
      <div className="border border-gray-300 rounded-md p-4 h-64 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
        <p>Loading editor...</p>
      </div>
    );
  }

  // Properly render CKEditor component
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <Editor.CKEditor
        editor={Editor.ClassicEditor}
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