import { useState } from "react";
import { FileText, Play, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { classifyMessage, SAMPLE_MESSAGES, ClassificationResult } from "@/lib/spamClassifier";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface BulkResult {
  text: string;
  expected: string;
  result: ClassificationResult;
  correct: boolean;
}

const BulkAnalyzer = () => {
  const [results, setResults] = useState<BulkResult[] | null>(null);
  const [running, setRunning] = useState(false);

  const runBulk = async () => {
    setRunning(true);
    setResults(null);
    await new Promise(r => setTimeout(r, 800));

    const bulk = SAMPLE_MESSAGES.map(s => {
      const result = classifyMessage(s.text);
      return { text: s.text, expected: s.expected, result, correct: result.label === s.expected };
    });
    setResults(bulk);
    setRunning(false);
  };

  const accuracy = results ? Math.round((results.filter(r => r.correct).length / results.length) * 100) : 0;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4" /> Bulk Test ({SAMPLE_MESSAGES.length} samples)
        </h3>
        <Button size="sm" onClick={runBulk} disabled={running} className="gradient-primary text-primary-foreground border-0 gap-1.5">
          <Play className="h-3.5 w-3.5" />
          {running ? "Running..." : "Run Test"}
        </Button>
      </div>

      {results && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/40">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Accuracy: {accuracy}%</p>
              <Progress value={accuracy} className="h-2 mt-1 [&>div]:bg-primary" />
            </div>
            <Badge variant="secondary" className={accuracy >= 80 ? 'bg-ham/10 text-ham' : 'bg-warning/10 text-warning'}>
              {accuracy >= 90 ? 'Excellent' : accuracy >= 80 ? 'Good' : 'Fair'}
            </Badge>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className={`p-3 rounded-lg border text-sm ${r.correct ? 'border-ham/20 bg-ham/5' : 'border-spam/20 bg-spam/5'}`}>
                <div className="flex items-start gap-2">
                  {r.result.label === 'spam' ? (
                    <ShieldAlert className="h-4 w-4 text-spam mt-0.5 shrink-0" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-ham mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate">{r.text}</p>
                    <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                      <span>Predicted: <span className="font-medium">{r.result.label}</span></span>
                      <span>•</span>
                      <span>Expected: <span className="font-medium">{r.expected}</span></span>
                      <span>•</span>
                      <span>{r.correct ? '✓ Correct' : '✗ Wrong'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkAnalyzer;
