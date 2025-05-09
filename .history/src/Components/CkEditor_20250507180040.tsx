/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
// Import types but handle the actual components via dynamic imports
import type { CKEditor as CKEditorType } from '@ckeditor/ckeditor5-react';
import type ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorProps {
  data: string;
  onChange: (event: any, editor: any) => void;
}

export default function CKEditorComponent({ data, onChange }: CKEditorProps) {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [CKEditorComponent, setCKEditorComponent] = useState<any>(null);
  const [Editor, setEditor] = useState<any>(null);

  useEffect(() => {
    // Only load on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Load the components dynamically to avoid SSR issues
    const loadEditor = async () => {
      try {
        // Use require instead of import to bypass TypeScript's strict type checking
        // This helps avoid the type conflicts between different CKEditor versions
        const CKEditorPkg = require('@ckeditor/ckeditor5-react');
        const ClassicEditorPkg = require('@ckeditor/ckeditor5-build-classic');
        
        setCKEditorComponent(CKEditorPkg.CKEditor);
        setEditor(ClassicEditorPkg.default);
        setEditorLoaded(true);
      } catch (error) {
        console.error("Failed to load CKEditor:", error);
      }
    };

    loadEditor();
  }, []);

  if (!editorLoaded) {
    return (
      <div className="border border-gray-300 rounded-md p-4 h-64 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
        <p>Loading editor...</p>
      </div>
    );
  }

  // Use type assertion to bypass TypeScript's type checking
  // This is necessary due to the multiple versions of the CKEditor packages
  const TypedCKEditor = CKEditorComponent as typeof CKEditorType;
  const TypedEditor = Editor as typeof ClassicEditor;

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <TypedCKEditor
        editor={TypedEditor}
        data={data}
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'blockQuote',
              'insertTable',
              '|',
              'undo',
              'redo'
            ]
          },
          licenseKey: '',
        }}
      />
    </div>
  );
}