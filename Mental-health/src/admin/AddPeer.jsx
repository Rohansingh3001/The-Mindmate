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
  "bg-pink-100 text-pink-800",
  "bg-purple-100 text-purple-800",
  "bg-blue-100 text-blue-800",
  "bg-yellow-100 text-yellow-800",
  "bg-green-100 text-green-800",
  "bg-red-100 text-red-800",
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
      alert("Please fill in all fields except color.");
      return;
    }

    const finalData = {
      name,
      email,
      tag,
      bio,
      color: color || "bg-gray-100 text-gray-800", // default color if none selected
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
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-300">
        {editId ? "✏️ Edit Peer Supporter" : "➕ Add Peer Supporter"}
      </h2>

      {/* Filter */}
      <div className="mb-6">
        <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Filter by Tag</label>
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="w-full max-w-xs px-4 py-2 rounded-md border dark:bg-zinc-800 dark:text-white"
        >
          <option value="">Show All</option>
          {tagOptions.map((tag) => (
            <option key={tag} value={tag}>{tag.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Form */}
      <div className="space-y-4 max-w-lg mb-10">
        <Input name="name" value={form.name} onChange={handleChange} placeholder="Peer Name *" />
        <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Peer Email (for login) *" />
        <select
          name="tag"
          value={form.tag}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-800 dark:text-white"
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
          className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-800 dark:text-white"
        >
          <option value="">(Optional) Select Tag Color</option>
          {colorOptions.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
        <Button onClick={handleSubmit}>{editId ? "Update Peer" : "Add Peer"}</Button>
      </div>

      {/* Peer List */}
      {Object.keys(filteredGroups).map((tag) => (
        <div key={tag} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 capitalize text-purple-600 dark:text-purple-300">
            🌀 {tag} Circle
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups[tag].map((peer) => (
              <div
                key={peer.id}
                className={`p-4 rounded-lg shadow ${peer.color || "bg-gray-100 text-gray-800"} flex flex-col justify-between`}
              >
                <div>
                  <h4 className="font-bold text-lg mb-1">{peer.name}</h4>
                  <p className="text-sm mb-2">{peer.bio}</p>
                  <span className="text-xs font-semibold uppercase bg-white/20 px-2 py-1 rounded block mb-1">
                    {peer.tag}
                  </span>
                  <span className="text-xs break-all">{peer.email}</span>
                </div>
                <div className="flex justify-between gap-2 mt-3">
                  <Button variant="outline" onClick={() => handleEdit(peer)}>Edit</Button>
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
  );
}
