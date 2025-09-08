import { useParams } from "react-router-dom";
import { getFromStorage, saveToStorage } from "../utils/storage";
import { moods } from "../utils/moods";
import { useState, useEffect } from "react";
import {
  SuccessIcon,
  ErrorIcon,
  InfoIcon,
  LoadingIcon,
  EmailIcon,
  ClickIcon,
} from "../components/MaterialIcons";

export default function RecipientView() {
  const { campaignId, recipientId } = useParams();
  const [hasOpened, setHasOpened] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true);
        const campaigns = getFromStorage("campaigns", []);
        const foundCampaign = campaigns.find((c) => c.id === campaignId);

        if (!foundCampaign) {
          setMessage({
            type: "error",
            text: "Campaign not found. The newsletter link may be invalid or expired.",
          });
          return;
        }

        const foundRecipient = foundCampaign.recipients.find((r) =>
          r.link.includes(recipientId)
        );

        if (!foundRecipient) {
          setMessage({
            type: "error",
            text: "Recipient not found. This newsletter link is not valid.",
          });
          return;
        }

        setCampaign(foundCampaign);
        setRecipient(foundRecipient);
        setMessage({
          type: "success",
          text: "Newsletter loaded successfully",
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: "Failed to load newsletter. Please try again.",
        });
        console.error("Error loading newsletter:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [campaignId, recipientId]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const markAsOpened = () => {
    if (hasOpened) return;

    try {
      const campaigns = getFromStorage("campaigns", []);
      const updatedCampaigns = campaigns.map((c) => {
        if (c.id === campaignId) {
          const opens = c.opens || [];
          if (!opens.includes(recipientId)) {
            return {
              ...c,
              opens: [...opens, recipientId],
            };
          }
        }
        return c;
      });

      saveToStorage("campaigns", updatedCampaigns);
      setHasOpened(true);
      showMessage("success", "Newsletter opened! Analytics updated.");
    } catch (error) {
      showMessage(
        "error",
        "Failed to track newsletter open. Please try again."
      );
      console.error("Error marking as opened:", error);
    }
  };

  const markClick = () => {
    if (hasClicked) return;

    try {
      const campaigns = getFromStorage("campaigns", []);
      const updatedCampaigns = campaigns.map((c) => {
        if (c.id === campaignId) {
          const clicks = c.clicks || [];
          if (!clicks.includes(recipientId)) {
            return {
              ...c,
              clicks: [...clicks, recipientId],
            };
          }
        }
        return c;
      });

      saveToStorage("campaigns", updatedCampaigns);
      setHasClicked(true);
      showMessage("success", "Thank you for your interest! You're now a lead.");
    } catch (error) {
      showMessage("error", "Failed to track click. Please try again.");
      console.error("Error marking click:", error);
    }
  };

  // Auto-mark as opened when component mounts
  useEffect(() => {
    if (campaign && recipient && !hasOpened) {
      markAsOpened();
    }
  }, [campaign, recipient, hasOpened]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading newsletter...</p>
        </div>
      </div>
    );
  }

  if (!campaign || !recipient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <EmailIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Newsletter Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            This newsletter could not be found or the link is invalid.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  const moodData = moods[campaign.mood] || moods.Celebration;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Message Display */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 ${
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

        {/* Newsletter Header */}
        <div className="text-center mb-8">
          <moodData.icon className="w-16 h-16 mx-auto mb-4" />
          <h1 className={`text-3xl font-bold ${moodData.textColor} mb-2`}>
            {campaign.subject}
          </h1>
          <p className="text-gray-600">
            Hello {recipient.name}! Here's your personalized newsletter.
          </p>
        </div>

        {/* Newsletter Content */}
        <div
          className={`p-8 rounded-2xl border-2 ${moodData.borderColor} ${moodData.color} shadow-lg`}
        >
          <div className={`${moodData.textColor} space-y-6`}>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {campaign.body}
              </p>
            </div>

            {campaign.ctaText && (
              <div className="text-center pt-6">
                <button
                  onClick={markClick}
                  disabled={hasClicked}
                  className={`px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 transform hover:scale-105 ${
                    hasClicked
                      ? "bg-green-500 cursor-not-allowed"
                      : `${moodData.ctaColor} hover:shadow-lg`
                  }`}
                >
                  {hasClicked ? "Thank You!" : campaign.ctaText}
                </button>
                {hasClicked && (
                  <p className="text-sm mt-2 opacity-75">
                    You've been added to our leads list!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Newsletter Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>This newsletter was sent to you as part of our email campaign.</p>
          <p className="mt-1">
            Sent on {new Date(campaign.date).toLocaleDateString()} • Mood:{" "}
            {campaign.mood}
          </p>
        </div>

        {/* Status Indicators */}
        <div className="mt-8 flex justify-center space-x-4">
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              hasOpened
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <span>
              {hasOpened ? (
                <SuccessIcon className="w-4 h-4" />
              ) : (
                <EmailIcon className="w-4 h-4" />
              )}
            </span>
            <span className="text-sm font-medium">
              {hasOpened ? "Opened" : "Not Opened"}
            </span>
          </div>

          {campaign.ctaText && (
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                hasClicked
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span>
                {hasClicked ? (
                  <SuccessIcon className="w-4 h-4" />
                ) : (
                  <ClickIcon className="w-4 h-4" />
                )}
              </span>
              <span className="text-sm font-medium">
                {hasClicked ? "Clicked" : "Not Clicked"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
