import { useState } from 'react';
import api from '../../utils/api.js';

export default function PersonalNotes({ notes = [] }) {
  const [note, setNote] = useState('');

  const addNote = async () => {
    if (!note.trim()) return;
    try {
      await api.post('/users/notes', { note });
      setNote('');
      alert('Note added');
      // Refresh notes
    } catch (err) {
      alert('Failed to add note');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add personal health note..."
          className="flex-1 p-2 border rounded"
          rows="3"
        />
        <button onClick={addNote} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
      </div>
      <ul>
        {notes.map((n, i) => (
          <li key={i} className="p-2 border-b">
            <p>{n.note}</p>
            <small className="block text-gray-500">{new Date(n.date).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}