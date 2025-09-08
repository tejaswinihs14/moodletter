import { useParams } from "react-router-dom";
import { getFromStorage, saveToStorage } from "../utils/storage";
import { moods } from "../utils/moods";
import { useState, useEffect } from "react";

export default function RecipientView() {
  const { campaignId, recipientId } = useParams();
  const [hasOpened, setHasOpened] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  const campaigns = getFromStorage("campaigns");
  const campaign = campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Campaign Not Found
          </h2>
          <p className="text-gray-600">
            The newsletter you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const recipient = campaign.recipients.find((r) =>
    r.link.includes(recipientId)
  );
  if (!recipient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Recipient Not Found
          </h2>
          <p className="text-gray-600">This newsletter link is not valid.</p>
        </div>
      </div>
    );
  }

  const moodData = moods[campaign.mood] || moods.Celebration;

  useEffect(() => {
    // Auto-mark as opened when the page loads
    if (!campaign.opens.includes(recipient.email)) {
      campaign.opens.push(recipient.email);
      saveToStorage("campaigns", campaigns);
      setHasOpened(true);
    } else {
      setHasOpened(true);
    }

    // Check if already clicked
    if (campaign.clicks.includes(recipient.email)) {
      setHasClicked(true);
    }
  }, [campaign, recipient.email, campaigns]);

  const markClick = () => {
    if (!campaign.clicks.includes(recipient.email)) {
      campaign.clicks.push(recipient.email);
      saveToStorage("campaigns", campaigns);
      setHasClicked(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Newsletter Display */}
        <div
          className={`p-8 rounded-2xl border-2 ${moodData.borderColor} ${moodData.color} shadow-lg`}
        >
          <div className="text-center mb-6">
            <span className="text-6xl mb-4 block">{moodData.icon}</span>
            <h1 className={`text-3xl font-bold ${moodData.textColor} mb-2`}>
              {campaign.subject}
            </h1>
            <p className={`text-sm ${moodData.textColor} opacity-75`}>
              Sent on {new Date(campaign.date).toLocaleDateString()}
            </p>
          </div>

          <div className={`${moodData.textColor} mb-8`}>
            <div className="prose prose-lg max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">
                {campaign.body}
              </p>
            </div>
          </div>

          <div className="text-center">
            {!hasClicked ? (
              <button
                onClick={markClick}
                className={`${moodData.ctaColor} text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg`}
              >
                {campaign.ctaText || "Learn More"}
              </button>
            ) : (
              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4">
                <div className="text-green-800 font-semibold text-lg">
                  ✅ Thank you for your interest!
                </div>
                <p className="text-green-600 text-sm mt-1">
                  We've recorded your click and will be in touch soon.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Info */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Newsletter Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {campaign.recipients.length}
              </div>
              <div className="text-sm text-blue-600">Total Recipients</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {campaign.opens.length}
              </div>
              <div className="text-sm text-green-600">Opens</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {campaign.clicks.length}
              </div>
              <div className="text-sm text-purple-600">Clicks</div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            {hasOpened && (
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full mr-2">
                ✅ You opened this newsletter
              </span>
            )}
            {hasClicked && (
              <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                🎯 You clicked the CTA
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
