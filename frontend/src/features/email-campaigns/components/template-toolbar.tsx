import type { Editor } from "@tiptap/react";
import { Bold, Heading2, Italic, Link, List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VariableInsertMenu } from "@/features/email-campaigns/components/variable-insert-menu";
import type { PersonalizationVariable } from "@/features/email-campaigns/types";
import { formatVariable } from "@/features/email-campaigns/utils/variable-utils";

export function TemplateToolbar({ editor }: { editor: Editor | null }) {
  function insertVariable(variable: PersonalizationVariable) {
    editor?.chain().focus().insertContent(formatVariable(variable.key)).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-bg-tertiary p-2">
      <Button
        variant={editor?.isActive("bold") ? "secondary" : "ghost"}
        size="icon"
        aria-label="Bold"
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={editor?.isActive("italic") ? "secondary" : "ghost"}
        size="icon"
        aria-label="Italic"
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={editor?.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
        size="icon"
        aria-label="Heading"
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant={editor?.isActive("bulletList") ? "secondary" : "ghost"}
        size="icon"
        aria-label="Bulleted list"
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={editor?.isActive("orderedList") ? "secondary" : "ghost"}
        size="icon"
        aria-label="Numbered list"
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Insert survey link"
        onClick={() => editor?.chain().focus().insertContent("<p>{{survey_link}}</p>").run()}
      >
        <Link className="h-4 w-4" />
      </Button>
      <div className="ml-auto">
        <VariableInsertMenu onInsert={insertVariable} />
      </div>
    </div>
  );
}
