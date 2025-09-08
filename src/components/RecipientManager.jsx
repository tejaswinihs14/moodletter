import { useState } from "react";
import { saveToStorage, getFromStorage } from "../utils/storage";
import { v4 as uuid } from "uuid";

export default function RecipientManager() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("recipients");

  // Group management states
  const [groupName, setGroupName] = useState("");
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const recipients = getFromStorage("recipients");
  const recipientGroups = getFromStorage("recipientGroups", []);

  const addRecipient = () => {
    if (!name || !email) return;
    if (editingId) {
      const updated = recipients.map((r) =>
        r.id === editingId ? { ...r, name, email } : r
      );
      saveToStorage("recipients", updated);
      setEditingId(null);
    } else {
      const updated = [...recipients, { id: uuid(), name, email }];
      saveToStorage("recipients", updated);
    }
    setName("");
    setEmail("");
  };

  const removeRecipient = (id) => {
    saveToStorage(
      "recipients",
      recipients.filter((r) => r.id !== id)
    );
    // Remove from all groups
    const updatedGroups = recipientGroups.map((group) => ({
      ...group,
      recipients: group.recipients.filter((recipientId) => recipientId !== id),
    }));
    saveToStorage("recipientGroups", updatedGroups);
  };

  const editRecipient = (r) => {
    setName(r.name);
    setEmail(r.email);
    setEditingId(r.id);
  };

  const addGroup = () => {
    if (!groupName.trim()) return;
    if (editingGroupId) {
      const updated = recipientGroups.map((g) =>
        g.id === editingGroupId
          ? { ...g, name: groupName, recipients: selectedRecipients }
          : g
      );
      saveToStorage("recipientGroups", updated);
      setEditingGroupId(null);
    } else {
      const newGroup = {
        id: uuid(),
        name: groupName,
        recipients: selectedRecipients,
      };
      saveToStorage("recipientGroups", [...recipientGroups, newGroup]);
    }
    setGroupName("");
    setSelectedRecipients([]);
  };

  const removeGroup = (id) => {
    saveToStorage(
      "recipientGroups",
      recipientGroups.filter((g) => g.id !== id)
    );
  };

  const editGroup = (group) => {
    setGroupName(group.name);
    setSelectedRecipients(group.recipients);
    setEditingGroupId(group.id);
  };

  const toggleRecipientInGroup = (recipientId) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipientId)
        ? prev.filter((id) => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  const getRecipientName = (id) => {
    const recipient = recipients.find((r) => r.id === id);
    return recipient ? `${recipient.name} (${recipient.email})` : "Unknown";
  };

  return (
    <div className="p-6 border rounded-xl shadow-lg bg-white">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("recipients")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "recipients"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          👥 Recipients ({recipients.length})
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "groups"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          📁 Groups ({recipientGroups.length})
        </button>
      </div>

      {activeTab === "recipients" && (
        <div>
          <h2 className="text-xl font-bold mb-4">👥 Manage Recipients</h2>

          {/* Add/Edit Recipient Form */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-3">
              {editingId ? "Edit Recipient" : "Add New Recipient"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addRecipient}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                {editingId ? "Update Recipient" : "Add Recipient"}
              </button>
            </div>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setEmail("");
                }}
                className="mt-2 text-gray-500 hover:text-gray-700"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* Recipients List */}
          <div className="space-y-2">
            {recipients.length === 0 ? (
              <p className="text-gray-500 italic text-center py-8">
                No recipients added yet
              </p>
            ) : (
              recipients.map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <span className="font-medium">{r.name}</span>
                    <span className="text-gray-500 ml-2">({r.email})</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editRecipient(r)}
                      className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => removeRecipient(r.id)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "groups" && (
        <div>
          <h2 className="text-xl font-bold mb-4">📁 Manage Recipient Groups</h2>

          {/* Add/Edit Group Form */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-3">
              {editingGroupId ? "Edit Group" : "Create New Group"}
            </h3>
            <div className="space-y-4">
              <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name (e.g., Donors, Friends, Students)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Recipients for this Group
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {recipients.map((recipient) => (
                    <label
                      key={recipient.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRecipients.includes(recipient.id)}
                        onChange={() => toggleRecipientInGroup(recipient.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">
                        {recipient.name} ({recipient.email})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={addGroup}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                {editingGroupId ? "Update Group" : "Create Group"}
              </button>

              {editingGroupId && (
                <button
                  onClick={() => {
                    setEditingGroupId(null);
                    setGroupName("");
                    setSelectedRecipients([]);
                  }}
                  className="ml-3 text-gray-500 hover:text-gray-700"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          {/* Groups List */}
          <div className="space-y-3">
            {recipientGroups.length === 0 ? (
              <p className="text-gray-500 italic text-center py-8">
                No groups created yet
              </p>
            ) : (
              recipientGroups.map((group) => (
                <div
                  key={group.id}
                  className="p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{group.name}</h4>
                      <p className="text-gray-600">
                        {group.recipients.length} recipients
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editGroup(group)}
                        className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => removeGroup(group.id)}
                        className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {group.recipients.length === 0 ? (
                      <p className="text-gray-500 italic text-sm">
                        No recipients in this group
                      </p>
                    ) : (
                      group.recipients.map((recipientId) => (
                        <div
                          key={recipientId}
                          className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded"
                        >
                          {getRecipientName(recipientId)}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
