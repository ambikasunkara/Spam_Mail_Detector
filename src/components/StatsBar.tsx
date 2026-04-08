import { HistoryEntry } from "./HistoryPanel";
import { BarChart3, ShieldAlert, ShieldCheck, Activity } from "lucide-react";

interface StatsBarProps {
  history: HistoryEntry[];
}

const StatsBar = ({ history }: StatsBarProps) => {
  const total = history.length;
  const spamCount = history.filter(h => h.result.label === 'spam').length;
  const hamCount = total - spamCount;
  const avgConfidence = total > 0 ? Math.round(history.reduce((s, h) => s + h.result.confidence, 0) / total) : 0;

  const stats = [
    { icon: BarChart3, label: "Total Scanned", value: total, color: "text-primary" },
    { icon: ShieldAlert, label: "Spam Found", value: spamCount, color: "text-spam" },
    { icon: ShieldCheck, label: "Safe Messages", value: hamCount, color: "text-ham" },
    { icon: Activity, label: "Avg Confidence", value: `${avgConfidence}%`, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
          <stat.icon className={`h-5 w-5 mx-auto mb-1.5 ${stat.color}`} />
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
