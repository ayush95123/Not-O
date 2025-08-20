"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ArchivedNoteCard from "@/components/ArchivedNoteCard";

async function fetchArchivedNotes() {
  const res = await fetch("/api/notes?archived=true");
  if (!res.ok) throw new Error("Failed to fetch archived notes");
  return res.json();
}

export default function ArchivesPage() {
  const queryClient = useQueryClient();

  // Fetch archived notes
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { archived: true }],
    queryFn: fetchArchivedNotes,
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notes/${id}/restore`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to restore note");
      return id;
    },
    // Optimistic Update
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notes", { archived: true }] });
      await queryClient.cancelQueries({ queryKey: ["notes", { archived: false }] });

      const prevArchived = queryClient.getQueryData<{ notes: any[] }>([
        "notes",
        { archived: true },
      ]);
      const prevSaved = queryClient.getQueryData<{ notes: any[] }>([
        "notes",
        { archived: false },
      ]);

      // Remove from archives
      if (prevArchived) {
        queryClient.setQueryData(["notes", { archived: true }], {
          notes: prevArchived.notes.filter((note) => note.id !== id),
        });
      }

      // Optimistically add to saved
      if (prevSaved && prevArchived) {
        const restoredNote = prevArchived.notes.find((note) => note.id === id);
        if (restoredNote) {
          queryClient.setQueryData(["notes", { archived: false }], {
            notes: [{ ...restoredNote, archived: false }, ...prevSaved.notes],
          });
        }
      }

      return { prevArchived, prevSaved };
    },
    // If error → rollback
    onError: (_err, _id, context) => {
      if (context?.prevArchived) {
        queryClient.setQueryData(["notes", { archived: true }], context.prevArchived);
      }
      if (context?.prevSaved) {
        queryClient.setQueryData(["notes", { archived: false }], context.prevSaved);
      }
    },
    // On success → revalidate both
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", { archived: true }] });
      queryClient.invalidateQueries({ queryKey: ["notes", { archived: false }] });
    },
  });

  if (isLoading) return <p>Loading archived notes...</p>;
  if (isError) return <p>Failed to load archived notes</p>;

  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.notes.length === 0 ? (
        <p className="text-muted-foreground">No archived notes</p>
      ) : (
        data.notes.map((note: any) => (
          <ArchivedNoteCard
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            createdAt={note.created_at}
            onDelete={(id) => console.log("delete clicked", id)}
            onRestore={(id) => restoreMutation.mutate(id)}
          />
        ))
      )}
    </div>
  );
}
