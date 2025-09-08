import { getFromStorage } from "../utils/storage";
import { moods } from "../utils/moods";

export default function AnalyticsView({ campaignId }) {
  const campaigns = getFromStorage("campaigns");
  const campaign = campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Campaign Not Found
          </h2>
          <p className="text-gray-600">
            The analytics for this campaign are not available.
          </p>
        </div>
      </div>
    );
  }

  const totalRecipients = campaign.recipients.length;
  const opens = campaign.opens || [];
  const clicks = campaign.clicks || [];
  const moodData = moods[campaign.mood] || moods.Celebration;

  const openRate =
    totalRecipients > 0
      ? ((opens.length / totalRecipients) * 100).toFixed(1)
      : 0;
  const clickThroughRate =
    totalRecipients > 0
      ? ((clicks.length / totalRecipients) * 100).toFixed(1)
      : 0;
  const conversionRate =
    opens.length > 0 ? ((clicks.length / opens.length) * 100).toFixed(1) : 0;

  // Calculate engagement score (weighted combination of opens and clicks)
  const engagementScore =
    totalRecipients > 0
      ? (
          ((opens.length * 1 + clicks.length * 3) / (totalRecipients * 3)) *
          100
        ).toFixed(1)
      : 0;

  // Simple progress bar component
  const ProgressBar = ({ percentage, color, label }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );

  // Simple chart component
  const SimpleChart = () => {
    const maxValue = Math.max(totalRecipients, opens.length, clicks.length);
    const scale = maxValue > 0 ? 100 / maxValue : 0;

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          📈 Performance Overview
        </h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 text-sm text-gray-600">Recipients</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${totalRecipients * scale}%` }}
              ></div>
            </div>
            <div className="w-12 text-sm font-semibold text-blue-600">
              {totalRecipients}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-20 text-sm text-gray-600">Opens</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${opens.length * scale}%` }}
              ></div>
            </div>
            <div className="w-12 text-sm font-semibold text-green-600">
              {opens.length}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-20 text-sm text-gray-600">Clicks</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div
                className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${clicks.length * scale}%` }}
              ></div>
            </div>
            <div className="w-12 text-sm font-semibold text-purple-600">
              {clicks.length}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-4xl">{moodData.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Campaign Analytics
              </h1>
              <p className="text-gray-600">
                Detailed performance insights for your newsletter
              </p>
            </div>
          </div>
        </div>

        {/* Campaign Info Card */}
        <div
          className={`p-6 rounded-xl border-2 ${moodData.borderColor} ${moodData.color} mb-8 shadow-lg`}
        >
          <h2 className={`text-2xl font-bold ${moodData.textColor} mb-4`}>
            {campaign.subject}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold">Mood:</span> {campaign.mood}
            </div>
            <div>
              <span className="font-semibold">Sent:</span>{" "}
              {new Date(campaign.date).toLocaleDateString()}
            </div>
            <div>
              <span className="font-semibold">Group:</span>{" "}
              {campaign.groupName || "All Recipients"}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {totalRecipients}
            </div>
            <div className="text-sm text-gray-600 mb-2">Total Recipients</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {openRate}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Open Rate</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${openRate}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {clickThroughRate}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Click-Through Rate</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${clickThroughRate}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {conversionRate}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Conversion Rate</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${conversionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Charts and Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SimpleChart />

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              🎯 Engagement Score
            </h4>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {engagementScore}%
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Overall Engagement
              </div>
              <ProgressBar
                percentage={engagementScore}
                color="bg-indigo-500"
                label="Engagement Score"
              />
            </div>
          </div>
        </div>

        {/* Detailed Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recipients who opened */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📧 Recipients who opened ({opens.length})
            </h3>
            {opens.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {opens.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg"
                  >
                    <span className="text-green-600">✅</span>
                    <span className="text-green-800 text-sm">{email}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-center py-8">
                No opens yet
              </p>
            )}
          </div>

          {/* Recipients who clicked (leads) */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🎯 Leads - Recipients who clicked ({clicks.length})
            </h3>
            {clicks.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {clicks.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 bg-purple-50 rounded-lg"
                  >
                    <span className="text-purple-600">🎯</span>
                    <span className="text-purple-800 text-sm">{email}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-center py-8">
                No clicks yet
              </p>
            )}
          </div>
        </div>

        {/* All Recipients Table */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            👥 All Recipients ({totalRecipients})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaign.recipients.map((recipient, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {recipient.email}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        {opens.includes(recipient.email) && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Opened
                          </span>
                        )}
                        {clicks.includes(recipient.email) && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                            Clicked
                          </span>
                        )}
                        {!opens.includes(recipient.email) &&
                          !clicks.includes(recipient.email) && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                              No Action
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <a
                        href={recipient.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        View Link
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
