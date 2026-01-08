'use client';

import { useState, useEffect } from 'react';
import NoteForm from '@/components/NoteForm';
import NoteList from '@/components/NoteList';
import { AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch('/api/notes');

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data.data || []);
    } catch (err) {
      setError('Unable to load notes. Please try again.');
      console.error('Fetch error:', err);
      toast.error('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (noteData) => {
    try {
      setIsSaving(true);
      setError('');

      let response;

      if (editingNote) {
        response = await fetch(`/api/notes?id=${editingNote._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
      } else {
        response = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      const data = await response.json();

      if (editingNote) {
        setNotes(notes.map((n) => (n._id === editingNote._id ? data.data : n)));
        toast.success('Note updated successfully!');
      } else {
        setNotes([data.data, ...notes]);
        toast.success('Note created successfully!');
      }

      setShowForm(false);
      setEditingNote(null);
    } catch (err) {
      const errorMsg = editingNote ? 'Failed to update note' : 'Failed to create note';
      setError(errorMsg);
      console.error('Save error:', err);
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowForm(true);
    setError('');
  };

  const handleDeleteClick = (noteId) => {
    setDeleteConfirm(noteId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      setError('');
      const response = await fetch(`/api/notes?id=${deleteConfirm}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      setNotes(notes.filter((n) => n._id !== deleteConfirm));
      setDeleteConfirm(null);
      toast.success('Note deleted successfully!');
    } catch (err) {
      const errorMsg = 'Failed to delete note';
      setError(errorMsg);
      console.error('Delete error:', err);
      toast.error(errorMsg);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  return (
    <div className="bg-gradient-to-br from-background via-background to-muted dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-200px)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Notes</h1>
            <p className="text-muted-foreground mt-2">Organize your thoughts and ideas</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingNote(null);
              setError('');
            }}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 shadow-md hover:shadow-lg"
            aria-label={showForm ? 'Close form' : 'Create new note'}
          >
            {showForm ? 'Cancel' : '+ New Note'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3" role="alert">
            <AlertCircle className="text-destructive flex-shrink-0 mt-0.5" size={20} />
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="text-destructive" size={24} />
                <h2 className="text-lg font-semibold text-foreground">
                  Delete note?
                </h2>
              </div>
              <p className="text-muted-foreground mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-muted text-muted-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors"
                  aria-label="Cancel delete"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground font-medium rounded-lg hover:bg-destructive/90 transition-colors"
                  aria-label="Confirm delete"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {showForm && (
            <NoteForm
              onSubmit={handleCreateOrUpdate}
              onCancel={handleCancel}
              initialData={editingNote}
              isLoading={isSaving}
            />
          )}

          <NoteList
            notes={notes}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
