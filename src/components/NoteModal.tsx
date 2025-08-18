"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

interface NoteModalProps {
  note: { id: string; title: string; content: string } | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (id: string, updatedContent: string) => Promise<void> | void;
}

export default function NoteModal({
  note,
  isOpen,
  onClose,
  onSave,
}: NoteModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draftContent, setDraftContent] = useState(note?.content || "");

  useEffect(() => {
    if (note) setDraftContent(note.content);
    setIsEditing(false);
    setIsSaving(false); // reset on reopen
  }, [note, isOpen]);

  if (!note) return null;

  const handleSave = async () => {
    if (!onSave) return;

    try {
      setIsSaving(true);
      await onSave(note.id, draftContent);
      toast.success("Note saved successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraftContent(note.content); // reset
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <DialogContent className="flex max-h-[80%] max-w-[75%] flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {note.title}
          </DialogTitle>
        </DialogHeader>

        <div className="no-scrollbar my-4 min-h-0 flex-1 overflow-y-auto">
          <div className="h-[60%] overflow-y-auto pr-2">
            {isEditing ? (
              <Textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                disabled={isSaving} // disable while saving
                className="min-h-[200px] w-full resize-none"
              />
            ) : (
              <p className="whitespace-pre-wrap text-gray-700">
                {note.content}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          {isEditing ? (
            <>
              <Button
                variant="default"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" disabled={isSaving}>
                Summarize
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                disabled={isSaving}
              >
                Edit
              </Button>
              <Button variant="outline" disabled={isSaving}>
                Archive
              </Button>
              <Button variant="destructive" disabled={isSaving}>
                Delete
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
