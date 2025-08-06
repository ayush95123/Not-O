import NoteForm from "@/app/(dashboard)/new-note/NoteForm";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

function page() {
  return (
    <div className="h-full">
      <NoteForm />
    </div>
  );
}

export default page;
