"use client";

import NotesList from "@/components/NoteCard";
import { useQuery } from "@tanstack/react-query";

async function fetchNotes() {
  const res = await fetch("/api/notes", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export default function SavedNotes() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes"], // unique key for caching
    queryFn: fetchNotes,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching notes</p>;

  return (
    <div className="mt-5">
      <NotesList notes={data.notes} />
    </div>
  );
}
