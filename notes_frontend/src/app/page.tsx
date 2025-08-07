"use client";

import React, { useState } from "react";

// Types for notes
type Note = {
  id: string;
  title: string;
  content: string;
  editedAt: string; // ISO date string
};

// --- MOCK DATA AREA ---
// Replace this with calls to your backend/database
const mockNotes: Note[] = [
  {
    id: "1",
    title: "First Note",
    content: "This is a sample note.\nYou can create, edit, or delete notes.",
    editedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Second Note",
    content: "Edit this note or add your own new note!",
    editedAt: new Date().toISOString(),
  },
];
// --- END MOCK DATA ---

export default function NotesApp() {
  // State for notes and selection
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [selectedId, setSelectedId] = useState<string | null>(
    notes.length > 0 ? notes[0].id : null
  );
  const [editing, setEditing] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(notes.length === 0);

  // Handlers for creating, updating, deleting
  // PUBLIC_INTERFACE
  function handleCreate(newTitle: string, newContent: string) {
    const note: Note = {
      id: (Math.random() * 100000).toFixed(0),
      title: newTitle,
      content: newContent,
      editedAt: new Date().toISOString(),
    };
    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
    setEditing(false);
    setCreating(false);
  }
  // PUBLIC_INTERFACE
  function handleUpdate(updated: Note) {
    setNotes((prev) =>
      prev.map((n) => (n.id === updated.id ? { ...updated, editedAt: new Date().toISOString() } : n))
    );
    setEditing(false);
    setCreating(false);
  }
  // PUBLIC_INTERFACE
  function handleDelete(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) {
      setSelectedId(notes.length > 1 ? notes.find((n) => n.id !== id)?.id ?? null : null);
      setEditing(false);
      setCreating(false);
    }
  }

  // Clear any editing if we select a new note
  function handleSelect(id: string) {
    setSelectedId(id);
    setEditing(false);
    setCreating(false);
  }

  // Render
  const selectedNote = notes.find((n) => n.id === selectedId);

  return (
    <>
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1.8rem" }}>
          <span style={{ fontSize: 27, fontWeight: 700, letterSpacing: -2, color: "white" }}>
            notes
          </span>
          <span className="accent-text" style={{ fontSize: 17, fontWeight: 400 }}>
            .
          </span>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setCreating(true);
            setEditing(false);
            setSelectedId(null);
          }}
        >
          + New Note
        </button>
        <div className="notes-list" style={{ marginTop: "2rem" }}>
          {notes.length === 0 ? (
            <div style={{ color: "#fbd7a0", textAlign: "center", fontSize: 16 }}>
              No notes yet.<br />
              <span style={{ color: "white" }}>Click [+ New Note]</span>
            </div>
          ) : (
            notes.map((note) => (
              <button
                className={`note-item${note.id === selectedId ? " selected" : ""}`}
                key={note.id}
                onClick={() => handleSelect(note.id)}
              >
                <span className="note-title">{note.title}</span>
                <span
                  style={{
                    fontSize: 11,
                    color:
                      note.id === selectedId
                        ? "var(--color-primary)"
                        : "var(--color-accent)",
                  }}
                >
                  {new Date(note.editedAt).toLocaleDateString()}
                </span>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* Show create, edit, or details view */}
          {creating ? (
            <NoteForm
              onSubmit={handleCreate}
              onCancel={() => setCreating(false)}
              theme="create"
            />
          ) : editing && selectedNote ? (
            <NoteForm
              onSubmit={(title, content) =>
                handleUpdate({ ...selectedNote, title, content })
              }
              onCancel={() => setEditing(false)}
              initialTitle={selectedNote.title}
              initialContent={selectedNote.content}
              theme="edit"
            />
          ) : selectedNote ? (
            <NoteView
              note={selectedNote}
              onEdit={() => setEditing(true)}
              onDelete={() => handleDelete(selectedNote.id)}
            />
          ) : (
            <div style={{ textAlign: "center", color: "var(--color-secondary)", marginTop: "5vh" }}>
              <span style={{ fontSize: 25, opacity: 0.6 }}>Welcome to Minimal Notes</span>
              <div style={{ fontSize: 16, color: "var(--color-accent)", marginTop: "1.4rem" }}>
                Select or create a note to begin.
              </div>
            </div>
          )}

          {/* Integration notes for developers */}
          <div style={{ marginTop: 30, fontSize: 13, color: "#b1b8c7" }}>
            {/* THIS BLOCK: instructions for future backend integration */}
            {/* Replace all uses of mockNotes and useState with API calls to your backend.
             For integration: replace handleCreate, handleUpdate, handleDelete, setNotes logic
             with async requests to your backend. */}
            <span>
              <b>Note for developers:</b> This app is currently running with mock data.<br />
              Integrate with the backend (e.g., &quot;notes_database&quot;) by replacing the local state logic and handlers with async calls.
            </span>
          </div>
        </div>
      </main>
    </>
  );
}

// PUBLIC_INTERFACE
function NoteView({
  note,
  onEdit,
  onDelete,
}: {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <section>
      <h2 style={{ fontSize: 26, fontWeight: 400, marginBottom: 9, color: "var(--color-primary)" }}>
        {note.title}
      </h2>
      <div style={{ color: "var(--color-secondary)", whiteSpace: "pre-wrap", marginBottom: 18 }}>
        {note.content}
      </div>
      <div
        style={{
          fontSize: 12,
          opacity: 0.5,
          marginBottom: 11,
        }}
      >
        Last edited: {new Date(note.editedAt).toLocaleString()}
      </div>
      <div className="button-group">
        <button className="btn-primary" onClick={onEdit}>
          Edit
        </button>
        <button
          className="btn-primary"
          style={{
            background: "#fda942",
            color: "#fff",
          }}
          onClick={() => {
            if (confirm("Delete this note?")) onDelete();
          }}
        >
          Delete
        </button>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function NoteForm({
  onSubmit,
  onCancel,
  initialTitle = "",
  initialContent = "",
  theme = "create",
}: {
  onSubmit: (title: string, content: string) => void;
  onCancel: () => void;
  initialTitle?: string;
  initialContent?: string;
  theme?: "create" | "edit";
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  return (
    <form
      className="notes-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit(title, content);
      }}
    >
      <label htmlFor="title" style={{ fontSize: 14, color: "var(--color-secondary)", marginBottom: 3, fontWeight: 500 }}>
        Title
      </label>
      <input
        id="title"
        value={title}
        placeholder="Enter a title..."
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        required
        maxLength={60}
        style={{ fontWeight: 500, background: "#f8fafc" }}
      />

      <label htmlFor="content" style={{ fontSize: 14, color: "var(--color-secondary)", marginBottom: 3 }}>
        Content
      </label>
      <textarea
        id="content"
        value={content}
        placeholder="Write your note here..."
        onChange={(e) => setContent(e.target.value)}
        required
        style={{ resize: 'vertical', background: "#f8fafc" }}
      />

      <div className="button-group" style={{ marginTop: 3 }}>
        <button className="btn-primary" type="submit">
          {theme === "edit" ? "Save" : "Create"}
        </button>
        <button
          className="btn-primary"
          type="button"
          style={{ background: "var(--color-secondary)" }}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
