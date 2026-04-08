import { ShieldCheck, ShieldAlert, AlertTriangle, TrendingUp } from "lucide-react";
import { ClassificationResult } from "@/lib/spamClassifier";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ResultCardProps {
  result: ClassificationResult;
  originalText: string;
}

const ResultCard = ({ result, originalText }: ResultCardProps) => {
  const isSpam = result.label === 'spam';

  return (
    <div className={`glass-card rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      {/* Verdict Banner */}
      <div className={`px-6 py-5 ${isSpam ? 'gradient-spam' : 'gradient-ham'}`}>
        <div className="flex items-center gap-3">
          {isSpam ? (
            <ShieldAlert className="h-8 w-8 text-spam-foreground" />
          ) : (
            <ShieldCheck className="h-8 w-8 text-ham-foreground" />
          )}
          <div>
            <h3 className="text-xl font-bold text-primary-foreground">
              {isSpam ? '🚫 Spam Detected' : '✅ Legitimate Message'}
            </h3>
            <p className="text-sm text-primary-foreground/80">
              {result.confidence}% confidence • Score: {result.spamScore}/100
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Spam Score Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spam Score</span>
            <span className="font-medium text-foreground">{result.spamScore}%</span>
          </div>
          <Progress value={result.spamScore} className={`h-2.5 ${isSpam ? '[&>div]:bg-spam' : '[&>div]:bg-ham'}`} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Safe</span>
            <span>Suspicious</span>
            <span>Spam</span>
          </div>
        </div>

        {/* Feature Analysis */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" /> Feature Analysis
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <FeatureStat label="Keywords" value={result.features.keywordsFound.length} warn={result.features.keywordsFound.length > 2} />
            <FeatureStat label="CAPS Ratio" value={`${(result.features.capsRatio * 100).toFixed(0)}%`} warn={result.features.capsRatio > 0.3} />
            <FeatureStat label="Exclamations" value={result.features.exclamationCount} warn={result.features.exclamationCount > 2} />
            <FeatureStat label="URLs" value={result.features.urlCount} warn={result.features.urlCount > 1} />
            <FeatureStat label="Numbers" value={result.features.numberCount} warn={result.features.numberCount > 3} />
            <FeatureStat label="Length" value={result.features.messageLength} />
          </div>
        </div>

        {/* Flagged Keywords */}
        {result.features.keywordsFound.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-warning" /> Flagged Keywords
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {result.features.keywordsFound.map((k, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-spam/10 text-spam border-spam/20">
                  {k.word} <span className="ml-1 opacity-60">({k.weight})</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Processed Tokens */}
        <details className="group">
          <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            View processed tokens ({result.tokens.length})
          </summary>
          <div className="mt-2 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground font-mono break-all">{result.processedText || '(empty after preprocessing)'}</p>
          </div>
        </details>
      </div>
    </div>
  );
};

function FeatureStat({ label, value, warn }: { label: string; value: string | number; warn?: boolean }) {
  return (
    <div className={`p-3 rounded-lg border ${warn ? 'border-warning/30 bg-warning/5' : 'border-border/50 bg-muted/30'}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-lg font-semibold ${warn ? 'text-warning' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}

export default ResultCard;
