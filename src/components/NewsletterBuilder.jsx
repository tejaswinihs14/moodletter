import { useState, useEffect } from "react";
import { moods } from "../utils/moods";
import { saveToStorage, getFromStorage } from "../utils/storage";
import { v4 as uuid } from "uuid";
import Dialog from "./Dialog";
import {
  SendIcon,
  PreviewIcon,
  SuccessIcon,
  ErrorIcon,
  InfoIcon,
  WarningIcon,
  EmailIcon,
  LoadingIcon,
} from "./MaterialIcons";

export default function NewsletterBuilder() {
  const [mood, setMood] = useState("Celebration");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [ctaText, setCtaText] = useState("Learn More");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedRecipients, setSelectedRecipients] = useState([]);
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

  const currentMood = moods[mood];
  const recipients = getFromStorage("recipients", []);
  const recipientGroups = getFromStorage("recipientGroups", []);

  // Update selected recipients when group changes
  useEffect(() => {
    if (selectedGroup === "all") {
      setSelectedRecipients(recipients);
    } else if (selectedGroup.startsWith("individual-")) {
      const recipientId = selectedGroup.replace("individual-", "");
      const recipient = recipients.find((r) => r.id === recipientId);
      setSelectedRecipients(recipient ? [recipient] : []);
    } else {
      const group = recipientGroups.find((g) => g.id === selectedGroup);
      if (group) {
        const groupRecipients = recipients.filter((r) =>
          group.recipients.includes(r.id)
        );
        setSelectedRecipients(groupRecipients);
      } else {
        setSelectedRecipients([]);
      }
    }
  }, [selectedGroup, recipients, recipientGroups]);

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

  const validateForm = () => {
    if (!subject.trim()) {
      showMessage("error", "Please enter a subject line");
      return false;
    }
    if (subject.length > 100) {
      showMessage("error", "Subject line must be 100 characters or less");
      return false;
    }
    if (!body.trim()) {
      showMessage("error", "Please enter newsletter content");
      return false;
    }
    if (body.length > 1000) {
      showMessage(
        "error",
        "Newsletter content must be 1000 characters or less"
      );
      return false;
    }
    if (selectedRecipients.length === 0) {
      showMessage(
        "error",
        "No recipients available. Please add recipients first."
      );
      return false;
    }
    return true;
  };

  const sendNewsletter = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const campaigns = getFromStorage("campaigns", []);
      const campaignId = uuid();

      const newCampaign = {
        id: campaignId,
        mood,
        subject: subject.trim(),
        body: body.trim(),
        ctaText: ctaText.trim() || "Learn More",
        date: new Date().toISOString(),
        recipients: selectedRecipients.map((r) => ({
          ...r,
          link: `/view/${campaignId}/${r.id}`,
        })),
        opens: [],
        clicks: [],
        groupName:
          selectedGroup === "all"
            ? "All Recipients"
            : recipientGroups.find((g) => g.id === selectedGroup)?.name ||
              "Unknown Group",
      };

      campaigns.push(newCampaign);
      saveToStorage("campaigns", campaigns);

      // Reset form
      setSubject("");
      setBody("");
      setCtaText("Learn More");
      setShowPreview(false);

      showMessage(
        "success",
        `Newsletter sent successfully to ${
          selectedRecipients.length
        } recipient${selectedRecipients.length > 1 ? "s" : ""}!`
      );
    } catch (error) {
      showMessage("error", "Failed to send newsletter. Please try again.");
      console.error("Error sending newsletter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecipientCount = () => {
    if (selectedGroup === "all") {
      return recipients.length;
    }
    const group = recipientGroups.find((g) => g.id === selectedGroup);
    return group ? group.recipients.length : 0;
  };

  const getRecipientOptions = () => {
    const options = [];

    // Add "All Recipients" option
    options.push(
      <option key="all" value="all">
        All Recipients ({recipients.length})
      </option>
    );

    // Add group options
    recipientGroups.forEach((group) => {
      const groupRecipients = recipients.filter((r) =>
        group.recipients.includes(r.id)
      );
      options.push(
        <option key={group.id} value={group.id}>
          {group.name} ({groupRecipients.length} recipients)
        </option>
      );
    });

    // Add individual recipient options
    recipients.forEach((recipient) => {
      options.push(
        <option
          key={`individual-${recipient.id}`}
          value={`individual-${recipient.id}`}
        >
          Individual: {recipient.email}
        </option>
      );
    });

    return options;
  };

  const handleGroupChange = (value) => {
    setSelectedGroup(value);

    if (value === "all") {
      setSelectedRecipients(recipients);
    } else if (value.startsWith("individual-")) {
      const recipientId = value.replace("individual-", "");
      const recipient = recipients.find((r) => r.id === recipientId);
      setSelectedRecipients(recipient ? [recipient] : []);
    } else {
      const group = recipientGroups.find((g) => g.id === value);
      if (group) {
        const groupRecipients = recipients.filter((r) =>
          group.recipients.includes(r.id)
        );
        setSelectedRecipients(groupRecipients);
      } else {
        setSelectedRecipients([]);
      }
    }
  };

  const NewsletterPreview = () => {
    const IconComponent = currentMood.icon;
    return (
      <div
        className={`p-4 sm:p-6 rounded-xl border-2 ${currentMood.borderColor} ${currentMood.color} overflow-hidden`}
      >
        <div className="text-center mb-4">
          <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
          <h3
            className={`text-lg sm:text-xl font-bold ${currentMood.textColor} mt-2 break-words overflow-wrap-anywhere`}
          >
            {subject || "Newsletter Subject"}
          </h3>
        </div>

        <div className={`${currentMood.textColor} space-y-4`}>
          <p className="text-sm leading-relaxed break-words overflow-wrap-anywhere">
            {body || "Your newsletter content will appear here..."}
          </p>

          {ctaText && (
            <div className="text-center pt-4">
              <button
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-white transition-colors text-sm sm:text-base ${currentMood.ctaColor}`}
              >
                {ctaText}
              </button>
            </div>
          )}
        </div>
      </div>
    );
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

      {/* Main Builder */}
      <div className="p-4 sm:p-6 border rounded-xl shadow-lg bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
            <EmailIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Create Newsletter
          </h2>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <PreviewIcon className="w-4 h-4" />
            <span className="hidden sm:inline">
              {showPreview ? "Hide Preview" : "Show Preview"}
            </span>
            <span className="sm:hidden">
              {showPreview ? "Hide" : "Preview"}
            </span>
          </button>
        </div>

        <div
          className={`grid gap-6 transition-all duration-300 ${
            showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* Form Section */}
          <div className="space-y-4">
            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Choose Mood/Theme *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {Object.entries(moods).map(([moodKey, moodData]) => {
                  const IconComponent = moodData.icon;
                  return (
                    <button
                      key={moodKey}
                      onClick={() => setMood(moodKey)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        mood === moodKey
                          ? `${moodData.borderColor} ${moodData.color} ${moodData.textColor}`
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-center">
                        <IconComponent className="w-8 h-8 mx-auto" />
                        <p className="text-sm font-medium mt-1">{moodKey}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {currentMood.description}
              </p>
            </div>

            {/* Recipient Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Send to Recipients *
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => handleGroupChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {recipients.length === 0 ? (
                  <option value="" disabled>
                    No recipients available - Add recipients first
                  </option>
                ) : (
                  getRecipientOptions()
                )}
              </select>

              {recipients.length === 0 && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700 flex items-center">
                    <WarningIcon className="w-4 h-4 mr-2" />
                    <span className="font-medium">No recipients found.</span> Go
                    to "Recipients" to add recipients first.
                  </p>
                </div>
              )}

              {selectedRecipients.length > 0 && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 flex items-center">
                    <EmailIcon className="w-4 h-4 mr-2" />
                    <span className="font-medium">Selected:</span>{" "}
                    {selectedRecipients.length} recipient
                    {selectedRecipients.length > 1 ? "s" : ""}
                    {selectedRecipients.length <= 3 && (
                      <span className="block mt-1">
                        {selectedRecipients.map((r) => r.email).join(", ")}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject Line *
              </label>
              <input
                placeholder="Enter your newsletter subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                  subject.length > 100
                    ? "border-red-300 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                maxLength={100}
              />
              <p
                className={`text-xs mt-1 ${
                  subject.length > 100
                    ? "text-red-500 font-medium"
                    : subject.length > 90
                    ? "text-yellow-600"
                    : "text-gray-500"
                }`}
              >
                {subject.length}/100 characters
                {subject.length > 100 && " (Exceeds limit!)"}
              </p>
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Newsletter Content *
              </label>
              <textarea
                placeholder="Write your newsletter content here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent resize-none ${
                  body.length > 1000
                    ? "border-red-300 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                maxLength={1000}
              />
              <p
                className={`text-xs mt-1 ${
                  body.length > 1000
                    ? "text-red-500 font-medium"
                    : body.length > 900
                    ? "text-yellow-600"
                    : "text-gray-500"
                }`}
              >
                {body.length}/1000 characters
                {body.length > 1000 && " (Exceeds limit!)"}
              </p>
            </div>

            {/* CTA Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Call-to-Action Button Text
              </label>
              <input
                placeholder="Learn More"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">
                {ctaText.length}/50 characters
              </p>
            </div>

            {/* Send Button */}
            <button
              onClick={sendNewsletter}
              disabled={
                isLoading ||
                selectedRecipients.length === 0 ||
                subject.length > 100 ||
                body.length > 1000
              }
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors flex items-center justify-center space-x-2 ${
                isLoading ||
                selectedRecipients.length === 0 ||
                subject.length > 100 ||
                body.length > 1000
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <>
                  <LoadingIcon className="w-5 h-5" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <SendIcon className="w-5 h-5" />
                  <span>
                    Send Newsletter to {selectedRecipients.length} Recipient
                    {selectedRecipients.length > 1 ? "s" : ""}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Preview Section */}
          <div
            className={`transition-all duration-300 ${
              showPreview ? "block opacity-100" : "hidden lg:block opacity-0"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <PreviewIcon className="w-5 h-5 mr-2" />
              Live Preview
            </h3>
            {showPreview ? (
              <NewsletterPreview />
            ) : (
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center min-h-[300px]">
                <div className="text-center text-gray-500">
                  <PreviewIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    Click "Show Preview" to see your newsletter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
