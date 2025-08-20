"use client";

import NotesList from "@/components/NoteCard";
import { useQuery } from "@tanstack/react-query";

async function fetchNotes({ queryKey }: { queryKey: [string, { archived: boolean }] }) {
  const [_key, { archived }] = queryKey;
  const res = await fetch(`/api/notes?archived=${archived}`, { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export default function SavedNotes() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { archived: false }], // unique key for caching
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
