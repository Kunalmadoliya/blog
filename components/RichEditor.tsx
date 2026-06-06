"use client";

import { useEditor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback } from "react";

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichEditor({
  content,
  onChange,
  placeholder = "Write your story...",
}: RichEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addBold = useCallback(
    () => editor?.chain().focus().toggleBold().run(),
    [editor],
  );
  const addItalic = useCallback(
    () => editor?.chain().focus().toggleItalic().run(),
    [editor],
  );
  const addCode = useCallback(
    () => editor?.chain().focus().toggleCode().run(),
    [editor],
  );
  const addCodeBlock = useCallback(
    () => editor?.chain().focus().toggleCodeBlock().run(),
    [editor],
  );
  const addHeading1 = useCallback(
    () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    [editor],
  );
  const addHeading2 = useCallback(
    () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    [editor],
  );
  const addBulletList = useCallback(
    () => editor?.chain().focus().toggleBulletList().run(),
    [editor],
  );
  const addOrderedList = useCallback(
    () => editor?.chain().focus().toggleOrderedList().run(),
    [editor],
  );

  const isActive = (command: string) => {
    switch (command) {
      case "bold":
        return editor?.isActive("bold");
      case "italic":
        return editor?.isActive("italic");
      case "code":
        return editor?.isActive("code");
      case "codeBlock":
        return editor?.isActive("codeBlock");
      case "h1":
        return editor?.isActive("heading", { level: 1 });
      case "h2":
        return editor?.isActive("heading", { level: 2 });
      case "bulletList":
        return editor?.isActive("bulletList");
      case "orderedList":
        return editor?.isActive("orderedList");
      default:
        return false;
    }
  };

  return (
    <div className="border border-border rounded">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-4 border-b border-border bg-secondary">
        <button
          onClick={addHeading1}
          className={`px-3 py-2 text-sm rounded border ${
            isActive("h1")
              ? "bg-primary text-primary-foreground"
              : "border-border hover:bg-background"
          }`}
        >
          H1
        </button>
        <button
          onClick={addHeading2}
          className={`px-3 py-2 text-sm rounded border ${
            isActive("h2")
              ? "bg-primary text-primary-foreground"
              : "border-border hover:bg-background"
          }`}
        >
          H2
        </button>
        <div className="w-px bg-border"></div>
        <button
          onClick={addBold}
          className={`px-3 py-2 text-sm rounded border font-bold ${
            isActive("bold")
              ? "bg-primary text-primary-foreground"
              : "border-border hover:bg-background"
          }`}
        >
          B
        </button>
        <button
          onClick={addItalic}
          className={`px-3 py-2 text-sm rounded border italic ${
            isActive("italic")
              ? "bg-primary text-primary-foreground"
              : "border-border hover:bg-background"
          }`}
        >
          I
        </button>
        <button
          onClick={addCode}
          className={`px-3 py-2 text-sm rounded border font-mono ${
            isActive("code")
              ? "bg-primary text-primary-foreground"
              : "border-border hover:bg-background"
          }`}
        >
          {`<>`}
        </button>
        <div className="w-px bg-border"></div>
        <button
          onClick={addCodeBlock}
          className={`px-3 py-2 text-sm rounded border ${
            isActive("codeBlock")
              ? "bg-primary text-primary-foreground"
              : "border-border hover:bg-background"
          }`}
        >
          Code Block
        </button>
        <div className="w-px bg-border"></div>
        <button
          onClick={addBulletList}
          className={`px-3 py-2 text-sm rounded border ${
            isActive("bulletList")
              ? "bg-primary text-primary-foreground"
              : "border-border hover:bg-background"
          }`}
        >
          • List
        </button>
        <button
          onClick={addOrderedList}
          className={`px-3 py-2 text-sm rounded border ${
            isActive("orderedList")
              ? "bg-primary text-primary-foreground"
              : "border-border hover:bg-background"
          }`}
        >
          1. List
        </button>
      </div>

      {/* Editor */}
      <div className="p-4 prose prose-sm dark:prose-invert max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
