'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function NoteForm({ onSubmit, onCancel, initialData, isLoading }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({ title: title.trim(), content: content.trim() });
  };

  const handleReset = () => {
    setTitle('');
    setContent('');
    setErrors({});
    onCancel();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm dark:shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          {initialData ? 'Edit Note' : 'Create New Note'}
        </h2>
        <button
          onClick={handleReset}
          className="p-1 text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-colors"
          title="Close form"
          type="button"
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="note-title" className="block text-sm font-medium text-foreground mb-2">
            Title
          </label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            maxLength={200}
            className={`w-full px-4 py-2 border rounded-lg font-sans text-base bg-background text-foreground focus:outline-none focus:ring-2 transition-all duration-150 ${
              errors.title ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
            }`}
            disabled={isLoading}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <p id="title-error" className="text-destructive text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="note-content" className="block text-sm font-medium text-foreground mb-2">
            Content
          </label>
          <textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter note content..."
            maxLength={5000}
            rows={6}
            className={`w-full px-4 py-2 border rounded-lg font-sans text-base bg-background text-foreground focus:outline-none focus:ring-2 resize-none transition-all duration-150 ${
              errors.content ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
            }`}
            disabled={isLoading}
            aria-describedby={errors.content ? 'content-error' : 'content-counter'}
          />
          {errors.content && (
            <p id="content-error" className="text-destructive text-sm mt-1">{errors.content}</p>
          )}
          <p id="content-counter" className="text-muted-foreground text-xs mt-2">
            {content.length}/5000 characters
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            aria-label={initialData ? 'Update note' : 'Create note'}
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Note' : 'Create Note'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="flex-1 bg-muted text-muted-foreground hover:bg-muted/80 font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            aria-label="Cancel"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
