import { useState } from "react";
import { moods } from "../utils/moods";
import { saveToStorage, getFromStorage } from "../utils/storage";
import { v4 as uuid } from "uuid";

export default function NewsletterBuilder() {
  const [mood, setMood] = useState("Celebration");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [ctaText, setCtaText] = useState("Learn More");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("all");

  const currentMood = moods[mood];
  const recipients = getFromStorage("recipients");
  const recipientGroups = getFromStorage("recipientGroups", []);

  const sendNewsletter = () => {
    if (!subject.trim() || !body.trim()) {
      alert("Please fill in both subject and body!");
      return;
    }

    const campaigns = getFromStorage("campaigns");
    let targetRecipients = recipients;

    // Filter by group if not "all"
    if (selectedGroup !== "all") {
      const group = recipientGroups.find((g) => g.id === selectedGroup);
      if (group) {
        targetRecipients = recipients.filter((r) =>
          group.recipients.includes(r.id)
        );
      }
    }

    if (targetRecipients.length === 0) {
      alert("No recipients found for the selected group!");
      return;
    }

    const newCampaign = {
      id: uuid(),
      mood,
      subject,
      body,
      ctaText,
      date: new Date().toISOString(),
      recipients: targetRecipients.map((r) => ({
        ...r,
        link: `/view/${uuid()}`,
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

    // Show detailed sending confirmation
    const confirmationMessage = `📧 Newsletter Sent Successfully!

✅ Campaign logged to history
📬 ${targetRecipients.length} emails sent to recipients
🔗 ${targetRecipients.length} unique tracking links generated
📊 Analytics tracking enabled

Recipients will receive emails with their unique links:
${targetRecipients
  .slice(0, 3)
  .map((r) => `• ${r.email}`)
  .join("\n")}${
      targetRecipients.length > 3
        ? `\n• ... and ${targetRecipients.length - 3} more`
        : ""
    }

Click "Campaigns" to view the campaign history and analytics!`;

    alert(confirmationMessage);
  };

  const NewsletterPreview = () => (
    <div
      className={`p-6 rounded-xl border-2 ${currentMood.borderColor} ${currentMood.color}`}
    >
      <div className="text-center mb-4">
        <span className="text-4xl">{currentMood.icon}</span>
        <h3 className={`text-xl font-bold ${currentMood.textColor} mt-2`}>
          {subject || "Your Newsletter Subject"}
        </h3>
      </div>

      <div className={`${currentMood.textColor} mb-6`}>
        <p className="whitespace-pre-wrap">
          {body || "Your newsletter content will appear here..."}
        </p>
      </div>

      <div className="text-center">
        <button
          className={`${currentMood.ctaColor} text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105`}
        >
          {ctaText}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Builder */}
      <div className="p-6 border rounded-xl shadow-lg bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📧 Create Newsletter
          </h2>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-4">
            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Choose Mood/Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(moods).map(([moodKey, moodData]) => (
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
                      <span className="text-2xl">{moodData.icon}</span>
                      <p className="text-sm font-medium mt-1">{moodKey}</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {currentMood.description}
              </p>
            </div>

            {/* Recipient Group Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Send to Group
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">
                  All Recipients ({recipients.length})
                </option>
                {recipientGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({group.recipients.length} recipients)
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject Line
              </label>
              <input
                placeholder="Enter your newsletter subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Newsletter Content
              </label>
              <textarea
                placeholder="Write your newsletter content here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* CTA Button Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Call-to-Action Button Text
              </label>
              <input
                placeholder="e.g., Learn More, Sign Up, Get Started"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={sendNewsletter}
              className={`w-full ${currentMood.ctaColor} text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg`}
            >
              🚀 Send Newsletter
            </button>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Preview
              </h3>
              <NewsletterPreview />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
