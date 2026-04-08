import { useState, useCallback } from "react";
import SpamHeader from "@/components/SpamHeader";
import ClassifierInput from "@/components/ClassifierInput";
import ResultCard from "@/components/ResultCard";
import HistoryPanel, { HistoryEntry } from "@/components/HistoryPanel";
import StatsBar from "@/components/StatsBar";
import BulkAnalyzer from "@/components/BulkAnalyzer";
import { classifyMessage, ClassificationResult } from "@/lib/spamClassifier";

const Index = () => {
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [originalText, setOriginalText] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleClassify = useCallback(async (text: string) => {
    setIsAnalyzing(true);
    setResult(null);
    // Simulate processing delay for UX
    await new Promise(r => setTimeout(r, 600));
    
    const classification = classifyMessage(text);
    setResult(classification);
    setOriginalText(text);
    setHistory(prev => [{
      id: crypto.randomUUID(),
      text,
      result: classification,
      timestamp: new Date(),
    }, ...prev]);
    setIsAnalyzing(false);
  }, []);

  const handleSelectHistory = useCallback((entry: HistoryEntry) => {
    setResult(entry.result);
    setOriginalText(entry.text);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SpamHeader />
      <main className="max-w-5xl mx-auto px-4 pb-12 space-y-6">
        <StatsBar history={history} />

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <ClassifierInput onClassify={handleClassify} isAnalyzing={isAnalyzing} />
            {result && <ResultCard result={result} originalText={originalText} />}
          </div>
          <div className="lg:col-span-2 space-y-6">
            <HistoryPanel history={history} onSelect={handleSelectHistory} onClear={() => setHistory([])} />
            <BulkAnalyzer />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
