"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  content: z.string().min(1, "Note cannot be empty"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NoteForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", content: "" },
  });

  const queryClient = useQueryClient();

  const addNoteMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to add note");
      }
      return res.json(); // return new note
    },
    onMutate: async (newNote) => {
      console.log("Optimistically adding note:", newNote);
      // cancel outgoing fetches
      await queryClient.cancelQueries({
        queryKey: ["notes", { archived: false }],
      });

      // snapshot previous state
      const prevNotes = queryClient.getQueryData<{ notes: any[] }>([
        "notes",
        { archived: false },
      ]);

      // 🔹 Create optimistic note with temp ID
      const optimisticNote = {
        id: `temp-${Date.now()}`, // temp unique id
        title: newNote.title,
        content: newNote.content,
        archived: false,
        created_at: new Date().toISOString(),
      };

      // optimistic update
      if (prevNotes) {
        queryClient.setQueryData(["notes", { archived: false }], {
          notes: [optimisticNote, ...prevNotes.notes],
        });
      } else {
        queryClient.setQueryData(["notes", { archived: false }], {
          notes: [optimisticNote],
        });
      }

      return { prevNotes };
    },
    onError: (err: any, _newNote, context) => {
      // rollback
      if (context?.prevNotes) {
        queryClient.setQueryData(
          ["notes", { archived: false }],
          context.prevNotes,
        );
      }
      toast.error(err.message || "Failed to add note");
    },
    onSuccess: () => {
      toast.success("Note added successfully");
      form.reset();
    },
    onSettled: () => {
      // refetch from server to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["notes", { archived: false }],
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    addNoteMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col items-center space-y-8 pt-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex h-2/12 w-full flex-col gap-y-3">
              <FormLabel className="ml-1">Note Title 🔖</FormLabel>
              <FormControl>
                <Input
                  disabled={addNoteMutation.isPending}
                  placeholder="Enter note title..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex h-7/12 w-full flex-col gap-y-3">
              <FormLabel className="ml-1">Note Content 📝</FormLabel>
              <FormControl>
                <Textarea
                  disabled={addNoteMutation.isPending}
                  placeholder="What's on your mind?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          disabled={addNoteMutation.isPending}
          type="submit"
          className="mb-5 px-10"
        >
          {addNoteMutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
