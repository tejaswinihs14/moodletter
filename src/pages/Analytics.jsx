import { useParams } from "react-router-dom";
import AnalyticsView from "../components/AnalyticsView";

export default function Analytics() {
  const { id } = useParams();
  return <AnalyticsView campaignId={id} />;
}