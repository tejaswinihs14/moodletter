import { useState } from "react";
import { Link } from "react-router-dom";
import { getFromStorage } from "../utils/storage";
import { moods } from "../utils/moods";
import Dialog from "./Dialog";
import {
  CampaignsIcon,
  LinkIcon,
  SuccessIcon,
  ErrorIcon,
  InfoIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  TrendingFlatIcon,
  LeadIcon,
} from "./MaterialIcons";

export default function CampaignHistory() {
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

  const campaigns = getFromStorage("campaigns", []);

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

  const getCampaignStats = (campaign) => {
    const totalRecipients = campaign.recipients.length;
    const opens = campaign.opens || [];
    const clicks = campaign.clicks || [];
    const openRate =
      totalRecipients > 0
        ? ((opens.length / totalRecipients) * 100).toFixed(1)
        : 0;
    const clickRate =
      totalRecipients > 0
        ? ((clicks.length / totalRecipients) * 100).toFixed(1)
        : 0;

    return {
      totalRecipients,
      opens: opens.length,
      clicks: clicks.length,
      openRate,
      clickRate,
    };
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const showTrackingLinks = (campaign) => {
    if (!campaign.recipients || campaign.recipients.length === 0) {
      showMessage("error", "No recipients found for this campaign");
      return;
    }

    const baseUrl = window.location.origin;
    const links = campaign.recipients
      .map((r) => `${baseUrl}${r.link}`)
      .join("\n");

    // Create a temporary textarea to copy to clipboard
    const textarea = document.createElement("textarea");
    textarea.value = links;
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      showMessage(
        "success",
        "Tracking links copied to clipboard! Paste them to test the email simulation."
      );
    } catch (error) {
      // Fallback: show in dialog
      showDialog("info", "Tracking Links", links);
      showMessage("info", "Tracking links displayed in dialog");
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const getPerformanceColor = (rate) => {
    const numRate = parseFloat(rate);
    if (numRate >= 50) return "text-green-600";
    if (numRate >= 25) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceIcon = (rate) => {
    const numRate = parseFloat(rate);
    if (numRate >= 50) return <TrendingUpIcon className="w-4 h-4" />;
    if (numRate >= 25) return <TrendingFlatIcon className="w-4 h-4" />;
    return <TrendingDownIcon className="w-4 h-4" />;
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

      {/* Campaign History Header */}
      <div className="p-6 border rounded-xl shadow-lg bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <CampaignsIcon className="w-6 h-6 mr-2" />
            Campaign History
          </h2>
          <div className="text-right">
            <span className="text-gray-600">
              {campaigns.length} campaigns sent
            </span>
            {campaigns.length > 0 && (
              <p className="text-sm text-gray-500">
                Total recipients:{" "}
                {campaigns.reduce((sum, c) => sum + c.recipients.length, 0)}
              </p>
            )}
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <EmailIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No campaigns yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first newsletter to get started!
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Newsletter
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const stats = getCampaignStats(campaign);
              const moodData = moods[campaign.mood] || moods.Celebration;

              return (
                <div
                  key={campaign.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <moodData.icon className="w-8 h-8" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {campaign.subject}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Sent to {campaign.groupName} •{" "}
                          {formatDate(campaign.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => showTrackingLinks(campaign)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center space-x-1"
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>Show Links</span>
                      </button>
                      <Link
                        to={`/analytics/${campaign.id}`}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center space-x-1"
                      >
                        <CampaignsIcon className="w-3 h-3" />
                        <span>View Analytics</span>
                      </Link>
                    </div>
                  </div>

                  {/* Campaign Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">
                        {stats.totalRecipients}
                      </div>
                      <div className="text-sm text-gray-600">Recipients</div>
                    </div>

                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.opens}
                      </div>
                      <div className="text-sm text-gray-600">Opens</div>
                    </div>

                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.clicks}
                      </div>
                      <div className="text-sm text-gray-600">Clicks</div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div
                        className={`text-2xl font-bold ${getPerformanceColor(
                          stats.openRate
                        )}`}
                      >
                        {stats.openRate}%
                      </div>
                      <div className="text-sm text-gray-600">Open Rate</div>
                    </div>
                  </div>

                  {/* Performance Indicators */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span
                        className={`flex items-center ${getPerformanceColor(
                          stats.openRate
                        )}`}
                      >
                        <span className="mr-1">
                          {getPerformanceIcon(stats.openRate)}
                        </span>
                        Open Rate: {stats.openRate}%
                      </span>
                      <span
                        className={`flex items-center ${getPerformanceColor(
                          stats.clickRate
                        )}`}
                      >
                        <span className="mr-1">
                          {getPerformanceIcon(stats.clickRate)}
                        </span>
                        Click Rate: {stats.clickRate}%
                      </span>
                    </div>

                    <div className="text-gray-500">
                      {stats.clicks > 0 && (
                        <span className="text-green-600 font-medium flex items-center">
                          <LeadIcon className="w-4 h-4 mr-1" />
                          {stats.clicks} lead{stats.clicks !== 1 ? "s" : ""}{" "}
                          generated
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Campaign Preview */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {campaign.body}
                    </p>
                    {campaign.ctaText && (
                      <div className="mt-2">
                        <span className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          CTA: {campaign.ctaText}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
