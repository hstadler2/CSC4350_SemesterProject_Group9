import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { api } from "../utils/api";

export default function HealthRecords() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [fileText, setFileText] = useState("");
  const [records, setRecords] = useState(api.listRecords(user.id));

  const upload = (e) => {
    e.preventDefault();
    const rec = api.addRecord({ userId: user.id, title: title || "Untitled", content: fileText });
    setRecords((r) => [rec, ...r]);
    setTitle("");
    setFileText("");
  };

  return (
    <section className="grid gap-6">
      <h1 className="text-2xl font-bold">Health Records</h1>
      <form onSubmit={upload} className="grid gap-3 border bg-white p-4 rounded-2xl">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Title</span>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-sm">Paste text (demo)</span>
            <textarea className="input min-h-[100px]" value={fileText} onChange={(e) => setFileText(e.target.value)} />
          </label>
        </div>
        <button className="btn-primary self-start">Upload</button>
      </form>

      <div className="border bg-white rounded-2xl">
        <div className="p-4 border-b font-semibold">Your files</div>
        <ul className="divide-y">
          {records.map((r) => (
            <li key={r.id} className="p-4 grid md:grid-cols-3 gap-2 text-sm">
              <span className="font-medium">{r.title}</span>
              <span className="truncate">{r.content.slice(0, 100) || "(empty)"}</span>
              <span className="justify-self-end">{new Date(r.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
          {records.length === 0 && <li className="p-4 text-sm text-gray-500">No records uploaded yet.</li>}
        </ul>
      </div>
    </section>
  );
}