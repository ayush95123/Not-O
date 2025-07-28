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
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// ✅ Schema
const formSchema = z.object({
  note: z.string().min(1, "Note cannot be empty"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NoteForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Note submitted:", values.note);
    // You can handle API calls here
    form.reset(); // Optional: clears textarea after submission
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col items-center space-y-8 pt-8"
      >
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem className="flex h-8/12 w-full flex-col justify-items-start gap-y-6">
              <FormLabel>Create new note 📝</FormLabel>
              <FormControl className="h-full">
                <Textarea
                  placeholder="What's on your mind?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="px-10">
          Submit
        </Button>
      </form>
    </Form>
  );
}
