import { Link } from "react-router-dom";
import { getFromStorage } from "../utils/storage";
import { moods } from "../utils/moods";

export default function CampaignHistory() {
  const campaigns = getFromStorage("campaigns");

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

  return (
    <div className="p-6 border rounded-xl shadow-lg bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📜 Campaign History
        </h2>
        <span className="text-gray-600">{campaigns.length} campaigns sent</span>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📧</div>
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
            const moodData = moods[campaign.mood] || moods.Celebration;
            const stats = getCampaignStats(campaign);

            return (
              <div
                key={campaign.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{moodData.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {campaign.subject}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${moodData.color} ${moodData.textColor}`}
                        >
                          {campaign.mood}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(campaign.date).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{campaign.groupName || "All Recipients"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/analytics/${campaign.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      View Analytics
                    </Link>
                    <button
                      onClick={() => {
                        const links = campaign.recipients
                          .map(
                            (r) => `${r.email}: http://localhost:5173${r.link}`
                          )
                          .join("\n");
                        alert(
                          `🔗 Recipient Tracking Links:\n\n${links}\n\nCopy these links to test the email simulation!`
                        );
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Show Links
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.totalRecipients}
                    </div>
                    <div className="text-xs text-gray-600">Recipients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.opens}
                    </div>
                    <div className="text-xs text-gray-600">Opens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.clicks}
                    </div>
                    <div className="text-xs text-gray-600">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {stats.openRate}%
                    </div>
                    <div className="text-xs text-gray-600">Open Rate</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="truncate">{campaign.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
