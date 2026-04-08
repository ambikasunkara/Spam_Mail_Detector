import { Clock, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassificationResult } from "@/lib/spamClassifier";

export interface HistoryEntry {
  id: string;
  text: string;
  result: ClassificationResult;
  timestamp: Date;
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

const HistoryPanel = ({ history, onSelect, onClear }: HistoryPanelProps) => {
  if (history.length === 0) return null;

  const spamCount = history.filter(h => h.result.label === 'spam').length;
  const hamCount = history.length - spamCount;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" /> History
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-xs">
            <span className="text-spam font-medium">{spamCount} spam</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-ham font-medium">{hamCount} ham</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive h-8 w-8 p-0">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors border border-transparent hover:border-border/50 group"
          >
            <div className="flex items-start gap-2.5">
              {entry.result.label === 'spam' ? (
                <ShieldAlert className="h-4 w-4 text-spam mt-0.5 shrink-0" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-ham mt-0.5 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground truncate">{entry.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {entry.result.confidence}% confidence • {entry.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
