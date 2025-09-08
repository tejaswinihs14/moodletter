import NewsletterBuilder from "../components/NewsletterBuilder";
import RecipientManager from "../components/RecipientManager";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to MoodLetter
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create beautiful, mood-based newsletters with advanced analytics.
          Choose from 8 different themes, manage recipient groups, and track
          engagement in real-time.
        </p>
      </div>

      <NewsletterBuilder />
      <RecipientManager />
    </div>
  );
}
