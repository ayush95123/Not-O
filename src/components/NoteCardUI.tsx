// components/NoteCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Archive } from "lucide-react";

type NoteCardProps = {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onClick?: () => void;
};

export default function NoteCard({
  id,
  title,
  content,
  createdAt,
  onDelete,
  onArchive,
  onClick
}: NoteCardProps) {
  return (
    <Card onClick={onClick} className="rounded-2xl shadow-sm hover:shadow-md transition bg-background hover:cursor-pointer">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onArchive?.(id)}
            className="h-8 w-8 hover:cursor-pointer"
          >
            <Archive className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete?.(id)}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {content ? (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {content}
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground">No content</p>
        )}
        <Badge variant="outline" className="text-xs">
          {new Date(createdAt).toLocaleDateString()}
        </Badge>
      </CardContent>
    </Card>
  );
}
