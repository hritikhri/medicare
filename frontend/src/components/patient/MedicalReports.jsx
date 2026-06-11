import { useState } from 'react';
import api from '../../utils/api.js';

export default function MedicalReports({ reports = [] }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    data.append('name', file.name);
    try {
      await api.post('/users/reports', data);
      alert('Report uploaded');
      // Refresh reports via query
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.jpg,.png" />
        <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      </div>
      <ul>
        {reports.map((report, i) => (
          <li key={i} className="flex justify-between p-2 border-b">
            <span>{report.name}</span>
            <div>
              <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 mr-4">Download</a>
              <button className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}