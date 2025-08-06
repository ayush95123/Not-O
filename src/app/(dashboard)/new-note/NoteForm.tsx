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
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";

const supabase = createSupabaseBrowserClient();

const formSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  content: z.string().min(1, "Note cannot be empty"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NoteForm() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else if (error) {
        console.error("Failed to fetch user:", error.message);
        toast.error("Authentication error. Please log in again.");
      }
    };

    getUser();
  }, []);

  const handleSubmit = form.handleSubmit(
    async (values) => {
       if (!userId) {
        toast.error("User not authenticated.");
        return;
      }

      setLoading(true);

      const { error } = await supabase.from("notes").insert({
        title: values.title,
        content: values.content,
        user_id: userId,
      });

      setLoading(false);

      if (error) {
        toast.error("Failed to add note: " + error.message);
        return;
      }

      toast.success("Note added successfully");
      form.reset();
    },
    (errors) => {
      // Show the first validation error as a toast
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message);
      } else {
        toast.error("Validation failed. Please check your inputs.");
      }
    },
  );

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col items-center space-y-8 pt-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex h-2/12 w-full flex-col justify-items-start gap-y-3">
              <FormLabel className="ml-1">Note Title 🔖</FormLabel>
              <FormControl className="h-full">
                {/* <Textarea
                  placeholder="Enter note title..."
                  className="h-10 resize-none"
                  {...field}
                /> */}
                <Input disabled={loading} placeholder="Enter note title..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex h-7/12 w-full flex-col justify-items-start gap-y-3">
              <FormLabel className="ml-1">Note Content 📝</FormLabel>
              <FormControl className="h-full">
                <Textarea
                  disabled={loading}
                  placeholder="What's on your mind?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button disabled={loading} type="submit" className="mb-5 px-10">
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
