'use client';

import { Trash2, Edit2 } from 'lucide-react';

export default function NoteCard({ note, onEdit, onDelete }) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200 hover:border-primary/20">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-2 break-words">
            {note.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 break-words">
            {note.content}
          </p>
          <p className="text-muted-foreground/60 text-xs">{formattedDate}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(note)}
            className="p-2 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-md transition-colors duration-150"
            title="Edit note"
            aria-label={`Edit note: ${note.title}`}
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="p-2 text-muted-foreground hover:text-destructive dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors duration-150"
            title="Delete note"
            aria-label={`Delete note: ${note.title}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
