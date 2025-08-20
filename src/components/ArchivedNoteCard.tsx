"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw } from "lucide-react";

type ArchivedNoteCardProps = {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
};

export default function ArchivedNoteCard({
  id,
  title,
  content,
  createdAt,
  onDelete,
  onRestore,
}: ArchivedNoteCardProps) {
  return (
    <Card className="bg-background rounded-2xl shadow-sm transition hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 hover:bg-green-100"
            onClick={() => onRestore?.(id)}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Restore
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete?.(id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {content ? (
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {content}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm italic">No content</p>
        )}
        <p className="text-xs text-gray-500">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
