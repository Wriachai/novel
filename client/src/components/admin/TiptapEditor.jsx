import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  CornerUpLeft,
  CornerUpRight,
  Slash,
} from "lucide-react";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const isActive = (name, options) => editor.isActive(name, options);

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {/* Basic styles */}
      <Button variant={isActive("bold") ? "default" : "outline"} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={16} />
      </Button>
      <Button variant={isActive("italic") ? "default" : "outline"} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={16} />
      </Button>
      <Button variant={isActive("strike") ? "default" : "outline"} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough size={16} />
      </Button>
      <Button variant={isActive("code") ? "default" : "outline"} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code size={16} />
      </Button>

      {/* Paragraph & headings */}
      <Button variant={isActive("paragraph") ? "default" : "outline"} onClick={() => editor.chain().focus().setParagraph().run()}>
        ¶
      </Button>
      {[1, 2, 3].map((level) => (
        <Button
          key={level}
          variant={isActive("heading", { level }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
        >
          H{level}
        </Button>
      ))}

      {/* Lists */}
      <Button variant={isActive("bulletList") ? "default" : "outline"} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={16} />
      </Button>
      <Button variant={isActive("orderedList") ? "default" : "outline"} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </Button>

      {/* Block elements */}
      <Button variant={isActive("blockquote") ? "default" : "outline"} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Slash size={16} />
      </Button>

      {/* Undo / Redo */}
      <Button disabled={!editor.can().chain().focus().undo().run()} onClick={() => editor.chain().focus().undo().run()}>
        <CornerUpLeft size={16} />
      </Button>
      <Button disabled={!editor.can().chain().focus().redo().run()} onClick={() => editor.chain().focus().redo().run()}>
        <CornerUpRight size={16} />
      </Button>
    </div>
  );
};

const TiptapEditor = ({ content, setContent, placeholder = "Start writing..." }) => {
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content: content || "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      setWordCount(editor.state.doc.content.size ? editor.getText().trim().split(/\s+/).length : 0);
    },
  });

  // Autosave simulation (could be replaced with API call)
  useEffect(() => {
    const interval = setInterval(() => {
      if (editor) {
        console.log("Autosave content:", editor.getHTML());
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [editor]);

  // Sync content if changed externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  return (
    <div className="border rounded-md p-2">
      <MenuBar editor={editor} />
      <div className="mb-1 text-sm text-gray-500">Word count: {wordCount}</div>
      <EditorContent editor={editor} className="min-h-[300px]" />
    </div>
  );
};

export default TiptapEditor;
