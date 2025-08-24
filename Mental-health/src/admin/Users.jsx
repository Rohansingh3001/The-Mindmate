import React, { useState, useEffect } from "react";
import { 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  Mail,
  Calendar,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  UserX,
  Shield,
  Eye as ViewIcon,
  Edit,
  Trash2,
  Ban,
  UserCheck
} from "lucide-react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showActions, setShowActions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or table

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          lastActive: doc.data().lastActive?.toDate?.() || new Date(),
          joinDate: doc.data().createdAt?.toDate?.() || new Date(),
        }));
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const name = user.fullName || user.displayName || "";
    const searchMatch = name.toLowerCase().includes(search.toLowerCase()) ||
                       user.email?.toLowerCase().includes(search.toLowerCase());
    
    if (filterBy === "all") return searchMatch;
    if (filterBy === "active") return searchMatch && user.isActive;
    if (filterBy === "flagged") return searchMatch && user.isFlagged;
    if (filterBy === "new") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return searchMatch && user.joinDate > weekAgo;
    }
    return searchMatch;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.fullName || a.displayName || "").localeCompare(b.fullName || b.displayName || "");
      case "joinDate":
        return new Date(b.joinDate) - new Date(a.joinDate);
      case "lastActive":
        return new Date(b.lastActive) - new Date(a.lastActive);
      case "moodScore":
        return (b.moodScore || 0) - (a.moodScore || 0);
      default:
        return 0;
    }
  });

  const toggleExpand = (id) => setExpandedUser(expandedUser === id ? null : id);

  const getMoodColor = (score) => {
    if (score >= 75) return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
    if (score >= 0) return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
    return "text-gray-500 bg-gray-100 dark:bg-gray-800";
  };

  const getStatusColor = (user) => {
    if (user.isFlagged) return "bg-red-500";
    if (user.isActive) return "bg-green-500";
    return "bg-gray-400";
  };

  const handleUserAction = async (action, userId) => {
    try {
      const userRef = doc(db, "users", userId);
      switch (action) {
        case "flag":
          await updateDoc(userRef, { isFlagged: true });
          break;
        case "unflag":
          await updateDoc(userRef, { isFlagged: false });
          break;
        case "activate":
          await updateDoc(userRef, { isActive: true });
          break;
        case "deactivate":
          await updateDoc(userRef, { isActive: false });
          break;
        case "delete":
          if (window.confirm("Are you sure you want to delete this user?")) {
            await deleteDoc(userRef);
          }
          break;
      }
      // Refresh users list
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        lastActive: doc.data().lastActive?.toDate?.() || new Date(),
        joinDate: doc.data().createdAt?.toDate?.() || new Date(),
      }));
      setUsers(data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
    setShowActions(null);
  };

  const exportUsers = () => {
    const csvContent = [
      ["Name", "Email", "Join Date", "Last Active", "Mood Score", "Status"],
      ...filteredUsers.map(user => [
        user.fullName || user.displayName || "N/A",
        user.email || "N/A",
        format(user.joinDate, "yyyy-MM-dd"),
        format(user.lastActive, "yyyy-MM-dd"),
        user.moodScore || "N/A",
        user.isActive ? "Active" : "Inactive"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            User Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and monitor all platform users
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="flex gap-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 border border-zinc-200 dark:border-zinc-700">
            <div className="text-2xl font-bold text-purple-600">{users.length}</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 border border-zinc-200 dark:border-zinc-700">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.isActive).length}
            </div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 border border-zinc-200 dark:border-zinc-700">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.isFlagged).length}
            </div>
            <div className="text-sm text-gray-500">Flagged</div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filters and Controls */}
          <div className="flex gap-3 items-center">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Users</option>
              <option value="active">Active Only</option>
              <option value="flagged">Flagged Only</option>
              <option value="new">New Users</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="name">Sort by Name</option>
              <option value="joinDate">Sort by Join Date</option>
              <option value="lastActive">Sort by Last Active</option>
              <option value="moodScore">Sort by Mood Score</option>
            </select>

            <div className="flex rounded-lg border border-gray-200 dark:border-zinc-600 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm ${viewMode === "grid" 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-50 dark:bg-zinc-700 text-gray-600 dark:text-gray-300"}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 text-sm ${viewMode === "table" 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-50 dark:bg-zinc-700 text-gray-600 dark:text-gray-300"}`}
              >
                Table
              </button>
            </div>

            <button
              onClick={exportUsers}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Users Display */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredUsers.map((user) => {
              const name = user.fullName || user.displayName || "Anonymous";
              const moodColorClass = getMoodColor(user.moodScore);

              return (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative group"
                >
                  {/* Status Indicator */}
                  <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${getStatusColor(user)}`}></div>

                  {/* User Avatar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">
                        {name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${moodColorClass}`}>
                        <Activity className="w-3 h-3 mr-1" />
                        {user.moodScore ?? "--"}%
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Mood Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {format(user.lastActive, "MMM dd")}
                      </div>
                      <p className="text-xs text-gray-500">Last Active</p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedUser === user.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-3"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">User ID:</span>
                          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {user.id.slice(-8)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Join Date:</span>
                          <span>{format(user.joinDate, "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Sessions:</span>
                          <span>{user.sessionCount || 0}</span>
                        </div>
                        {user.isFlagged && (
                          <div className="flex items-center gap-2 text-red-600 text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            <span>User is flagged for review</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => toggleExpand(user.id)}
                      className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {expandedUser === user.id ? (
                        <>
                          <ChevronUp className="w-4 h-4" /> Hide Details
                        </>
                      ) : (
                        <>
                          <ViewIcon className="w-4 h-4" /> View Details
                        </>
                      )}
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      <AnimatePresence>
                        {showActions === user.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-10"
                          >
                            <div className="py-2">
                              {user.isFlagged ? (
                                <button
                                  onClick={() => handleUserAction("unflag", user.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  Unflag User
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserAction("flag", user.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                  Flag User
                                </button>
                              )}
                              
                              {user.isActive ? (
                                <button
                                  onClick={() => handleUserAction("deactivate", user.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                  <UserX className="w-4 h-4 text-orange-500" />
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserAction("activate", user.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                  <UserCheck className="w-4 h-4 text-green-500" />
                                  Activate
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleUserAction("delete", user.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete User
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-zinc-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Mood Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => {
                    const name = user.fullName || user.displayName || "Anonymous";
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {name}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(user)}`}></div>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                            {user.isFlagged && (
                              <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMoodColor(user.moodScore)}`}>
                            {user.moodScore ?? "--"}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(user.lastActive, "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(user.joinDate, "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative">
                            <button
                              onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No users found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
