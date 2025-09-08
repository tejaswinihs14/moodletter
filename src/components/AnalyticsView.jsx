import { useState, useEffect } from "react";
import { getFromStorage } from "../utils/storage";
import { moods } from "../utils/moods";
import {
  AnalyticsIcon,
  SuccessIcon,
  ErrorIcon,
  InfoIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  TrendingFlatIcon,
  OpenIcon,
  ClickIcon,
  LeadIcon,
  CampaignsIcon,
} from "./MaterialIcons";

export default function AnalyticsView({ campaignId }) {
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const loadCampaign = () => {
      try {
        setIsLoading(true);
        const campaigns = getFromStorage("campaigns", []);
        const foundCampaign = campaigns.find((c) => c.id === campaignId);

        if (!foundCampaign) {
          setMessage({
            type: "error",
            text: "Campaign not found. It may have been deleted or the link is invalid.",
          });
          return;
        }

        setCampaign(foundCampaign);
        setMessage({
          type: "success",
          text: "Analytics loaded successfully",
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: "Failed to load campaign analytics. Please try again.",
        });
        console.error("Error loading campaign:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AnalyticsIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Campaign Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The analytics for this campaign are not available.
          </p>
          <a
            href="/campaigns"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Campaigns
          </a>
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
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-bold ${color}`}>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            color === "text-green-600"
              ? "bg-green-500"
              : color === "text-yellow-600"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );

  // Simple bar chart component
  const BarChart = ({ data, title }) => (
    <div className="bg-white p-4 rounded-lg border">
      <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm text-gray-600">{item.label}</div>
            <div className="flex-1 mx-2">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (item.value / Math.max(...data.map((d) => d.value))) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="w-12 text-sm font-medium text-gray-800">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
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

      {/* Campaign Header */}
      <div className="p-6 border rounded-xl shadow-lg bg-white">
        <div className="flex items-center space-x-4 mb-4">
          <moodData.icon className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {campaign.subject}
            </h1>
            <p className="text-gray-600">
              Sent to {campaign.groupName} • {formatDate(campaign.date)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Mood/Theme</div>
            <div className="font-semibold text-gray-800">{campaign.mood}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Total Recipients</div>
            <div className="font-semibold text-gray-800">{totalRecipients}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Engagement Score</div>
            <div
              className={`font-semibold ${getPerformanceColor(
                engagementScore
              )}`}
            >
              {engagementScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 border rounded-xl shadow-lg bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Open Rate</h3>
            <OpenIcon className="w-6 h-6" />
          </div>
          <div
            className={`text-3xl font-bold ${getPerformanceColor(openRate)}`}
          >
            {openRate}%
          </div>
          <p className="text-sm text-gray-600">
            {opens.length} of {totalRecipients} recipients opened
          </p>
          <ProgressBar
            percentage={openRate}
            color={getPerformanceColor(openRate)}
            label=""
          />
        </div>

        <div className="p-6 border rounded-xl shadow-lg bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Click Rate</h3>
            <ClickIcon className="w-6 h-6" />
          </div>
          <div
            className={`text-3xl font-bold ${getPerformanceColor(
              clickThroughRate
            )}`}
          >
            {clickThroughRate}%
          </div>
          <p className="text-sm text-gray-600">
            {clicks.length} of {totalRecipients} recipients clicked
          </p>
          <ProgressBar
            percentage={clickThroughRate}
            color={getPerformanceColor(clickThroughRate)}
            label=""
          />
        </div>

        <div className="p-6 border rounded-xl shadow-lg bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Conversion Rate
            </h3>
            <LeadIcon className="w-6 h-6" />
          </div>
          <div
            className={`text-3xl font-bold ${getPerformanceColor(
              conversionRate
            )}`}
          >
            {conversionRate}%
          </div>
          <p className="text-sm text-gray-600">
            {clicks.length} of {opens.length} opens converted
          </p>
          <ProgressBar
            percentage={conversionRate}
            color={getPerformanceColor(conversionRate)}
            label=""
          />
        </div>

        <div className="p-6 border rounded-xl shadow-lg bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Engagement</h3>
            <span className="text-2xl">
              {getPerformanceIcon(engagementScore)}
            </span>
          </div>
          <div
            className={`text-3xl font-bold ${getPerformanceColor(
              engagementScore
            )}`}
          >
            {engagementScore}%
          </div>
          <p className="text-sm text-gray-600">Overall engagement score</p>
          <ProgressBar
            percentage={engagementScore}
            color={getPerformanceColor(engagementScore)}
            label=""
          />
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={[
            { label: "Opens", value: opens.length },
            { label: "Clicks", value: clicks.length },
            { label: "Total", value: totalRecipients },
          ]}
          title="Engagement Overview"
        />

        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <TrendingUpIcon className="w-4 h-4 mr-2" />
            Performance Trends
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Open Rate</span>
              <span className={`font-medium ${getPerformanceColor(openRate)}`}>
                {getPerformanceIcon(openRate)} {openRate}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Click Rate</span>
              <span
                className={`font-medium ${getPerformanceColor(
                  clickThroughRate
                )}`}
              >
                {getPerformanceIcon(clickThroughRate)} {clickThroughRate}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span
                className={`font-medium ${getPerformanceColor(conversionRate)}`}
              >
                {getPerformanceIcon(conversionRate)} {conversionRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recipients who opened */}
        <div className="p-6 border rounded-xl shadow-lg bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <OpenIcon className="w-5 h-5 mr-2" />
            Recipients Who Opened ({opens.length})
          </h3>
          {opens.length === 0 ? (
            <p className="text-gray-500 text-sm">No opens yet</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {opens.map((open, index) => {
                const recipient = campaign.recipients.find(
                  (r) => r.id === open
                );
                return (
                  <div key={index} className="p-2 bg-green-50 rounded text-sm">
                    <div className="font-medium text-green-800">
                      {recipient?.name || "Unknown"}
                    </div>
                    <div className="text-green-600">
                      {recipient?.email || "Unknown"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recipients who clicked (leads) */}
        <div className="p-6 border rounded-xl shadow-lg bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <LeadIcon className="w-5 h-5 mr-2" />
            Leads - Recipients Who Clicked ({clicks.length})
          </h3>
          {clicks.length === 0 ? (
            <p className="text-gray-500 text-sm">No clicks yet</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {clicks.map((click, index) => {
                const recipient = campaign.recipients.find(
                  (r) => r.id === click
                );
                return (
                  <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                    <div className="font-medium text-blue-800">
                      {recipient?.name || "Unknown"}
                    </div>
                    <div className="text-blue-600">
                      {recipient?.email || "Unknown"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* All recipients */}
        <div className="p-6 border rounded-xl shadow-lg bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            All Recipients ({totalRecipients})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {campaign.recipients.map((recipient) => {
              const hasOpened = opens.includes(recipient.id);
              const hasClicked = clicks.includes(recipient.id);

              let statusColor = "bg-gray-50 text-gray-600";
              let statusText = "Not opened";

              if (hasClicked) {
                statusColor = "bg-blue-50 text-blue-800";
                statusText = "Clicked (Lead)";
              } else if (hasOpened) {
                statusColor = "bg-green-50 text-green-800";
                statusText = "Opened";
              }

              return (
                <div key={recipient.id} className="p-2 rounded text-sm">
                  <div className="font-medium text-gray-800">
                    {recipient.name}
                  </div>
                  <div className="text-gray-600">{recipient.email}</div>
                  <div
                    className={`text-xs px-2 py-1 rounded mt-1 inline-block ${statusColor}`}
                  >
                    {statusText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Campaign Content Preview */}
      <div className="p-6 border rounded-xl shadow-lg bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <CampaignsIcon className="w-5 h-5 mr-2" />
          Campaign Content Preview
        </h3>
        <div
          className={`p-4 rounded-lg border-2 ${moodData.borderColor} ${moodData.color}`}
        >
          <div className="text-center mb-4">
            <moodData.icon className="w-12 h-12 mx-auto" />
            <h4 className={`text-xl font-bold ${moodData.textColor} mt-2`}>
              {campaign.subject}
            </h4>
          </div>
          <div className={`${moodData.textColor} space-y-3`}>
            <p className="text-sm leading-relaxed">{campaign.body}</p>
            {campaign.ctaText && (
              <div className="text-center pt-3">
                <button
                  className={`px-4 py-2 rounded-lg font-semibold text-white ${moodData.ctaColor}`}
                >
                  {campaign.ctaText}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
