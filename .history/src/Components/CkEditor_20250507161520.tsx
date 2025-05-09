/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
// Import these directly at the top level
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CKEditorProps {
  data: string;
  onChange: (event: any, editor: any) => void;
}

export default function CKEditorComponent({ data, onChange }: CKEditorProps) {
  // We'll use this to ensure we're only rendering on the client
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If we haven't mounted yet, show a loading indicator
  if (!isMounted) {
    return (
      <div className="border border-gray-300 rounded-md p-4 h-64 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
        <p>Loading editor...</p>
      </div>
    );
  }

  // We're on the client, render the editor
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <CKEditor
        editor={ClassicEditor}
        data={data}
        onChange={onChange}
      />
    </div>
  );
}