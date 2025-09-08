import { useState, useEffect } from "react";
import { saveToStorage, getFromStorage } from "../utils/storage";
import { v4 as uuid } from "uuid";
import Dialog from "./Dialog";
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  SaveIcon,
  SuccessIcon,
  ErrorIcon,
  InfoIcon,
  WarningIcon,
  GroupIcon,
  UserIcon,
  LoadingIcon,
} from "./MaterialIcons";

export default function RecipientManager() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("recipients");

  // Group management states
  const [groupName, setGroupName] = useState("");
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  // Message states
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
    showCancel: false,
  });

  const recipients = getFromStorage("recipients", []);
  const recipientGroups = getFromStorage("recipientGroups", []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const showDialog = (
    type,
    title,
    message,
    onConfirm = null,
    showCancel = false
  ) => {
    setDialog({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      showCancel,
    });
  };

  const closeDialog = () => {
    setDialog({
      isOpen: false,
      type: "info",
      title: "",
      message: "",
      onConfirm: null,
      showCancel: false,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateRecipient = () => {
    if (!name.trim()) {
      showMessage("error", "Please enter a recipient name");
      return false;
    }
    if (!email.trim()) {
      showMessage("error", "Please enter an email address");
      return false;
    }
    if (!validateEmail(email.trim())) {
      showMessage("error", "Please enter a valid email address");
      return false;
    }

    // Check for duplicate email
    const existingRecipient = recipients.find(
      (r) =>
        r.email.toLowerCase() === email.trim().toLowerCase() &&
        r.id !== editingId
    );
    if (existingRecipient) {
      showMessage("error", "A recipient with this email already exists");
      return false;
    }

    return true;
  };

  const addRecipient = async () => {
    if (!validateRecipient()) return;

    setIsLoading(true);

    try {
      if (editingId) {
        const updated = recipients.map((r) =>
          r.id === editingId
            ? { ...r, name: name.trim(), email: email.trim().toLowerCase() }
            : r
        );
        saveToStorage("recipients", updated);
        showMessage("success", "Recipient updated successfully!");
        setEditingId(null);
      } else {
        const newRecipient = {
          id: uuid(),
          name: name.trim(),
          email: email.trim().toLowerCase(),
        };
        const updated = [...recipients, newRecipient];
        saveToStorage("recipients", updated);
        showMessage("success", "Recipient added successfully!");
      }

      setName("");
      setEmail("");
    } catch (error) {
      showMessage("error", "Failed to save recipient. Please try again.");
      console.error("Error saving recipient:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeRecipient = async (id) => {
    showDialog(
      "confirm",
      "Delete Recipient",
      "Are you sure you want to delete this recipient? This action cannot be undone.",
      () => performRemoveRecipient(id),
      true
    );
  };

  const performRemoveRecipient = async (id) => {
    setIsLoading(true);

    try {
      // Remove recipient
      const updatedRecipients = recipients.filter((r) => r.id !== id);
      saveToStorage("recipients", updatedRecipients);

      // Remove from all groups
      const updatedGroups = recipientGroups.map((group) => ({
        ...group,
        recipients: group.recipients.filter(
          (recipientId) => recipientId !== id
        ),
      }));
      saveToStorage("recipientGroups", updatedGroups);

      showMessage("success", "Recipient deleted successfully!");
    } catch (error) {
      showMessage("error", "Failed to delete recipient. Please try again.");
      console.error("Error deleting recipient:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const editRecipient = (r) => {
    setName(r.name);
    setEmail(r.email);
    setEditingId(r.id);
  };

  const cancelEdit = () => {
    setName("");
    setEmail("");
    setEditingId(null);
  };

  // Group management functions
  const validateGroup = () => {
    if (!groupName.trim()) {
      showMessage("error", "Please enter a group name");
      return false;
    }

    // Check for duplicate group name
    const existingGroup = recipientGroups.find(
      (g) =>
        g.name.toLowerCase() === groupName.trim().toLowerCase() &&
        g.id !== editingGroupId
    );
    if (existingGroup) {
      showMessage("error", "A group with this name already exists");
      return false;
    }

    if (selectedRecipients.length === 0) {
      showMessage(
        "error",
        "Please select at least one recipient for the group"
      );
      return false;
    }

    return true;
  };

  const addGroup = async () => {
    if (!validateGroup()) return;

    setIsLoading(true);

    try {
      if (editingGroupId) {
        const updated = recipientGroups.map((g) =>
          g.id === editingGroupId
            ? { ...g, name: groupName.trim(), recipients: selectedRecipients }
            : g
        );
        saveToStorage("recipientGroups", updated);
        showMessage("success", "Group updated successfully!");
        setEditingGroupId(null);
      } else {
        const newGroup = {
          id: uuid(),
          name: groupName.trim(),
          recipients: selectedRecipients,
        };
        const updated = [...recipientGroups, newGroup];
        saveToStorage("recipientGroups", updated);
        showMessage("success", "Group created successfully!");
      }

      setGroupName("");
      setSelectedRecipients([]);
    } catch (error) {
      showMessage("error", "Failed to save group. Please try again.");
      console.error("Error saving group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeGroup = async (id) => {
    showDialog(
      "confirm",
      "Delete Group",
      "Are you sure you want to delete this group? This action cannot be undone.",
      () => performRemoveGroup(id),
      true
    );
  };

  const performRemoveGroup = async (id) => {
    setIsLoading(true);

    try {
      const updated = recipientGroups.filter((g) => g.id !== id);
      saveToStorage("recipientGroups", updated);
      showMessage("success", "Group deleted successfully!");
    } catch (error) {
      showMessage("error", "Failed to delete group. Please try again.");
      console.error("Error deleting group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const editGroup = (group) => {
    setGroupName(group.name);
    setSelectedRecipients(group.recipients);
    setEditingGroupId(group.id);
  };

  const cancelGroupEdit = () => {
    setGroupName("");
    setSelectedRecipients([]);
    setEditingGroupId(null);
  };

  const toggleRecipientSelection = (recipientId) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipientId)
        ? prev.filter((id) => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  const getGroupRecipients = (group) => {
    return recipients.filter((r) => group.recipients.includes(r.id));
  };

  return (
    <div className="space-y-6">
      {/* Dialog */}
      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        showCancel={dialog.showCancel}
      />

      {/* Message Display */}
      {message.text && (
        <div
          className={`p-4 rounded-lg border-l-4 ${
            message.type === "success"
              ? "bg-green-50 border-green-400 text-green-700"
              : message.type === "error"
              ? "bg-red-50 border-red-400 text-red-700"
              : "bg-blue-50 border-blue-400 text-blue-700"
          }`}
        >
          <div className="flex items-center">
            <span className="mr-2">
              {message.type === "success" ? (
                <SuccessIcon className="w-5 h-5" />
              ) : message.type === "error" ? (
                <ErrorIcon className="w-5 h-5" />
              ) : (
                <InfoIcon className="w-5 h-5" />
              )}
            </span>
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("recipients")}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === "recipients"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Recipients ({recipients.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === "groups"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <GroupIcon className="w-4 h-4" />
            <span>Groups ({recipientGroups.length})</span>
          </button>
        </nav>
      </div>

      {/* Recipients Tab */}
      {activeTab === "recipients" && (
        <div className="space-y-6">
          {/* Add Recipient Form */}
          <div className="p-6 border rounded-xl shadow-lg bg-white">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              {editingId ? (
                <>
                  <EditIcon className="w-5 h-5 mr-2" />
                  Edit Recipient
                </>
              ) : (
                <>
                  <AddIcon className="w-5 h-5 mr-2" />
                  Add New Recipient
                </>
              )}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter recipient name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={addRecipient}
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors flex items-center space-x-2 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? (
                  <>
                    <LoadingIcon className="w-4 h-4" />
                    <span>Saving...</span>
                  </>
                ) : editingId ? (
                  <>
                    <SaveIcon className="w-4 h-4" />
                    <span>Update Recipient</span>
                  </>
                ) : (
                  <>
                    <AddIcon className="w-4 h-4" />
                    <span>Add Recipient</span>
                  </>
                )}
              </button>
              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Recipients List */}
          <div className="p-6 border rounded-xl shadow-lg bg-white">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Recipients List
            </h3>
            {recipients.length === 0 ? (
              <div className="text-center py-8">
                <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                  No recipients yet
                </h4>
                <p className="text-gray-500">
                  Add your first recipient using the form above.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {recipient.name}
                      </h4>
                      <p className="text-sm text-gray-600">{recipient.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editRecipient(recipient)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center space-x-1"
                      >
                        <EditIcon className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => removeRecipient(recipient.id)}
                        disabled={isLoading}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center space-x-1"
                      >
                        <DeleteIcon className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Groups Tab */}
      {activeTab === "groups" && (
        <div className="space-y-6">
          {/* Add Group Form */}
          <div className="p-6 border rounded-xl shadow-lg bg-white">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              {editingGroupId ? (
                <>
                  <EditIcon className="w-5 h-5 mr-2" />
                  Edit Group
                </>
              ) : (
                <>
                  <AddIcon className="w-5 h-5 mr-2" />
                  Create New Group
                </>
              )}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter group name..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={100}
                />
              </div>

              {recipients.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    <span className="font-medium">
                      No recipients available.
                    </span>{" "}
                    Add recipients first before creating groups.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Recipients * ({selectedRecipients.length} selected)
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                    {recipients.map((recipient) => (
                      <label
                        key={recipient.id}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRecipients.includes(recipient.id)}
                          onChange={() =>
                            toggleRecipientSelection(recipient.id)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-medium text-gray-800">
                            {recipient.name}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            ({recipient.email})
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={addGroup}
                disabled={isLoading || recipients.length === 0}
                className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors flex items-center space-x-2 ${
                  isLoading || recipients.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? (
                  <>
                    <LoadingIcon className="w-4 h-4" />
                    <span>Saving...</span>
                  </>
                ) : editingGroupId ? (
                  <>
                    <SaveIcon className="w-4 h-4" />
                    <span>Update Group</span>
                  </>
                ) : (
                  <>
                    <AddIcon className="w-4 h-4" />
                    <span>Create Group</span>
                  </>
                )}
              </button>
              {editingGroupId && (
                <button
                  onClick={cancelGroupEdit}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Groups List */}
          <div className="p-6 border rounded-xl shadow-lg bg-white">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <GroupIcon className="w-5 h-5 mr-2" />
              Recipient Groups
            </h3>
            {recipientGroups.length === 0 ? (
              <div className="text-center py-8">
                <GroupIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                  No groups yet
                </h4>
                <p className="text-gray-500">
                  Create your first group using the form above.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recipientGroups.map((group) => {
                  const groupRecipients = getGroupRecipients(group);
                  return (
                    <div
                      key={group.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {group.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {groupRecipients.length} recipient
                            {groupRecipients.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editGroup(group)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center space-x-1"
                          >
                            <EditIcon className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => removeGroup(group.id)}
                            disabled={isLoading}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center space-x-1"
                          >
                            <DeleteIcon className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      {groupRecipients.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Recipients:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {groupRecipients.map((recipient) => (
                              <span
                                key={recipient.id}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                              >
                                {recipient.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
