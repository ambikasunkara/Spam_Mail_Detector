import { Shield, Mail } from "lucide-react";

const SpamHeader = () => {
  return (
    <header className="w-full py-6 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="gradient-primary p-2.5 rounded-xl">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">SpamShield</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Email Classifier</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Spam Detection Engine v1.0</span>
        </div>
      </div>
    </header>
  );
};

export default SpamHeader;
