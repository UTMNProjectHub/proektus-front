
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
    Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Code, Quote, Minus, Undo, Redo
} from 'lucide-react';

interface EditorToolbarProps {
    editor: Editor | null;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 mb-2">
            <Button
                variant={editor.isActive('bold') ? 'default' : 'outline'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('italic') ? 'default' : 'outline'}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('strike') ? 'default' : 'outline'}
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
            >
                <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
            >
                <Heading3 className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('bulletList') ? 'default' : 'outline'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={!editor.can().chain().focus().toggleBulletList().run()}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('orderedList') ? 'default' : 'outline'}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('codeBlock') ? 'default' : 'outline'}
                size="sm"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
            >
                <Code className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('blockquote') ? 'default' : 'outline'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                disabled={!editor.can().chain().focus().toggleBlockquote().run()}
            >
                <Quote className="h-4 w-4" />
            </Button>
            <Button
                variant={'outline'}
                size="sm"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                disabled={!editor.can().chain().focus().setHorizontalRule().run()}
            >
                <Minus className="h-4 w-4" />
            </Button>
            <Button
                variant={'outline'}
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                <Undo className="h-4 w-4" />
            </Button>
            <Button
                variant={'outline'}
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
            >
                <Redo className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default EditorToolbar;
