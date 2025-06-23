import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const tagOptions = [
  "anxiety", "self-esteem", "family", "friendship",
  "academic", "relationship", "career", "lgbtq"
];

const colorOptions = [
  { name: "Pink", value: "bg-pink-100 text-pink-800" },
  { name: "Purple", value: "bg-purple-100 text-purple-800" },
  { name: "Blue", value: "bg-blue-100 text-blue-800" },
  { name: "Yellow", value: "bg-yellow-100 text-yellow-800" },
  { name: "Green", value: "bg-green-100 text-green-800" },
  { name: "Red", value: "bg-red-100 text-red-800" },
];

export default function AddPeer() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    tag: "",
    bio: "",
    color: "",
  });
  const [peers, setPeers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [filterTag, setFilterTag] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "peers"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPeers(data);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, email, tag, bio, color } = form;
    if (!name || !email || !tag || !bio) {
      alert("Please fill in all required fields.");
      return;
    }

    const finalData = {
      name,
      email,
      tag,
      bio,
      color: color || "bg-gray-100 text-gray-800",
    };

    try {
      if (editId) {
        await updateDoc(doc(db, "peers", editId), finalData);
        alert("Peer updated successfully!");
        setEditId(null);
      } else {
        await addDoc(collection(db, "peers"), finalData);
        alert("Peer added successfully!");
      }
      setForm({ name: "", email: "", tag: "", bio: "", color: "" });
    } catch (error) {
      console.error("Error adding/updating peer:", error);
      alert("Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this peer?")) return;
    try {
      await deleteDoc(doc(db, "peers", id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (peer) => {
    setForm({
      name: peer.name,
      email: peer.email || "",
      tag: peer.tag,
      bio: peer.bio,
      color: peer.color || "",
    });
    setEditId(peer.id);
  };

  const groupedPeers = peers.reduce((groups, peer) => {
    if (!groups[peer.tag]) groups[peer.tag] = [];
    groups[peer.tag].push(peer);
    return groups;
  }, {});

  const filteredGroups = filterTag
    ? { [filterTag]: groupedPeers[filterTag] || [] }
    : groupedPeers;

  return (
    <div className="min-h-screen py-12 px-6 bg-white dark:bg-zinc-900 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-800 shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-700 dark:text-purple-300">
          {editId ? "✏️ Edit Peer Supporter" : "➕ Add Peer Supporter"}
        </h2>

        {/* Filter */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Filter by Tag</label>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="w-full md:max-w-xs px-4 py-2 rounded-md border dark:bg-zinc-700 dark:border-zinc-600"
          >
            <option value="">Show All</option>
            {tagOptions.map((tag) => (
              <option key={tag} value={tag}>
                {tag.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Peer Name *" />
          <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Peer Email *" />
          <select
            name="tag"
            value={form.tag}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-700 dark:border-zinc-600"
          >
            <option value="">Select Tag *</option>
            {tagOptions.map((tag) => (
              <option key={tag} value={tag}>{tag.toUpperCase()}</option>
            ))}
          </select>
          <Input name="bio" value={form.bio} onChange={handleChange} placeholder="Short Bio *" />
          <select
            name="color"
            value={form.color}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-700 dark:border-zinc-600"
          >
            <option value="">Select Tag Color (optional)</option>
            {colorOptions.map((c, i) => (
              <option key={i} value={c.value}>{c.name}</option>
            ))}
          </select>
        </div>
        <Button onClick={handleSubmit} className="w-full mb-6">
          {editId ? "Update Peer" : "Add Peer"}
        </Button>
      </div>

      {/* Peer Cards */}
      <div className="mt-14 max-w-6xl mx-auto space-y-10">
        {Object.keys(filteredGroups).map((tag) => (
          <div key={tag}>
            <h3 className="text-xl font-semibold mb-4 text-purple-600 dark:text-purple-300">
              🌀 {tag.charAt(0).toUpperCase() + tag.slice(1)} Circle
            </h3>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGroups[tag].map((peer) => (
                <div
                  key={peer.id}
                  className={`p-5 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700 transition-transform transform hover:scale-[1.02] ${peer.color || "bg-gray-100 text-gray-800"}`}
                >
                  <div className="mb-3">
                    <h4 className="text-lg font-bold">{peer.name}</h4>
                    <p className="text-sm mb-1">{peer.bio}</p>
                    <span className="text-xs inline-block bg-white/30 px-2 py-1 rounded uppercase font-semibold">
                      {peer.tag}
                    </span>
                    <div className="text-xs mt-2 break-words">{peer.email}</div>
                  </div>
                  <div className="flex justify-between gap-2 mt-4">
                    <Button variant="outline" onClick={() => handleEdit(peer)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(peer.id)}
                      className="text-red-600 border-red-400 hover:bg-red-100 dark:hover:bg-red-800"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
