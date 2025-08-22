"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Loader2, ChevronDown } from "lucide-react";

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

  // summarization state
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  // when true, we switch from plain read-only to collapsible UI
  const [showCollapsibles, setShowCollapsibles] = useState(false);
  const [origOpen, setOrigOpen] = useState(false);     // original note collapsible
  const [summaryOpen, setSummaryOpen] = useState(true); // summary collapsible

  useEffect(() => {
    if (note) setDraftContent(note.content);
    setIsEditing(false);
    setIsSaving(false);
    // reset summarize UI
    setIsSummarizing(false);
    setSummary(null);
    setShowCollapsibles(false);
    setOrigOpen(false);
    setSummaryOpen(true);
  }, [note, isOpen]);

  if (!note) return null;

  const handleSave = async () => {
    if (!onSave) return;
    try {
      setIsSaving(true);
      await onSave(note.id, draftContent);
      toast.success("Note saved successfully");
      setIsEditing(false);
    } catch {
      toast.error("Failed to save note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraftContent(note.content);
    setIsEditing(false);
  };

  const handleSummarize = async () => {
    try {
      // switch to collapsible UI and close original by default
      setShowCollapsibles(true);
      setOrigOpen(false);
      setSummary(null);
      setSummaryOpen(true);
      setIsSummarizing(true);

      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: note.content }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to summarize");
      }

      setSummary(data.summary);
      setSummaryOpen(true);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong while summarizing");
      // keep collapsible UI so user can try again, but no summary section shown
    } finally {
      setIsSummarizing(false);
    }
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
                disabled={isSaving}
                className="min-h-[200px] w-full resize-none"
              />
            ) : !showCollapsibles ? (
              // Default read-only view before summarizing
              <p className="whitespace-pre-wrap text-gray-700">
                {note.content}
              </p>
            ) : (
              // Collapsible UI after clicking Summarize
              <div className="space-y-3">
                {/* Original Note */}
                <Collapsible open={origOpen} onOpenChange={setOrigOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-between"
                    >
                      <span className="font-medium">Original note</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          origOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 rounded-md border p-3">
                    <p className="whitespace-pre-wrap text-gray-700">
                      {note.content}
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                {/* Loader while summarizing (no summary placeholder) */}
                {isSummarizing && (
                  <div className="flex items-center gap-2 rounded-md border p-3 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Summarizing your note...
                  </div>
                )}

                {/* Show Summary collapsible ONLY after we have the text */}
                {summary && !isSummarizing && (
                  <Collapsible open={summaryOpen} onOpenChange={setSummaryOpen}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex w-full items-center justify-between"
                      >
                        <span className="font-medium">Summary</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            summaryOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 rounded-md border bg-muted p-3">
                      <p className="whitespace-pre-wrap text-muted-foreground">
                        {summary}
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
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
              <Button
                variant="outline"
                disabled={isSaving || isSummarizing}
                onClick={handleSummarize}
              >
                {isSummarizing ? "Summarizing..." : "Summarize"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                disabled={isSaving || isSummarizing}
              >
                Edit
              </Button>
              <Button variant="outline" disabled={isSaving || isSummarizing}>
                Archive
              </Button>
              <Button variant="destructive" disabled={isSaving || isSummarizing}>
                Delete
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
