import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import Analytics from "./pages/Analytics";
import RecipientView from "./pages/RecipientView";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/analytics/:id" element={<Analytics />} />
          <Route
            path="/view/:campaignId/:recipientId"
            element={<RecipientView />}
          />
        </Routes>
      </main>
    </div>
  );
}
