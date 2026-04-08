import { useState } from "react";
import { Send, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SAMPLE_MESSAGES } from "@/lib/spamClassifier";

interface ClassifierInputProps {
  onClassify: (text: string) => void;
  isAnalyzing: boolean;
}

const ClassifierInput = ({ onClassify, isAnalyzing }: ClassifierInputProps) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) onClassify(text.trim());
  };

  const handleSample = () => {
    const sample = SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)];
    setText(sample.text);
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Analyze Message</h2>
        <Button variant="ghost" size="sm" onClick={handleSample} className="text-muted-foreground hover:text-foreground gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Try Sample
        </Button>
      </div>
      <Textarea
        placeholder="Paste an email or message here to check if it's spam..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[140px] resize-none bg-background/50 border-border/50 focus:border-primary/50 text-sm"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{text.length} characters</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setText("")} disabled={!text} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={!text.trim() || isAnalyzing} className="gradient-primary text-primary-foreground gap-1.5 border-0">
            <Send className="h-3.5 w-3.5" />
            {isAnalyzing ? "Analyzing..." : "Classify"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClassifierInput;
