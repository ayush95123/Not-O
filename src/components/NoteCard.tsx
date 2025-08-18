import { useState } from "react";
import NoteCard from "./NoteCardUI";
import NoteModal from "./NoteModal";

export default function NotesList({ notes }: { notes: any[] }) {
  const [selectedNote, setSelectedNote] = useState<any | null>(null);
  const [allNotes, setAllNotes] = useState(notes); // keep local copy

  const handleSave = async (id: string, updatedContent: string) => {
    try {
      // 🔹 Call your PUT API
      const res = await fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: selectedNote?.title, // keep same title
          content: updatedContent,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to update note");
      }

      // 🔹 Update local state so UI refreshes without reload
      setAllNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, content: updatedContent } : note
        )
      );

      // close modal
      setSelectedNote(null);
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Failed to update note. Please try again.");
    }
  };
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <NoteCard
          key={note.id}
          id={note.id}
          title={note.title}
          content={note.content}
          createdAt={note.created_at}
          onDelete={(id) => console.log("delete", id)}
          onArchive={(id) => console.log("archive", id)}
          onClick={() => setSelectedNote(note)}
        />
      ))}
      <NoteModal
        note={selectedNote}
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        onSave={handleSave}
      />
    </div>
  );
}
