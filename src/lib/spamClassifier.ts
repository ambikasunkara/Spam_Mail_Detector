// Spam detection engine using keyword-based TF-IDF-like scoring + heuristics

const SPAM_KEYWORDS: Record<string, number> = {
  'free': 3, 'win': 4, 'winner': 5, 'won': 4, 'prize': 5, 'cash': 4,
  'money': 3, 'urgent': 4, 'congratulations': 5, 'claim': 4, 'click': 3,
  'subscribe': 2, 'offer': 3, 'deal': 2, 'discount': 3, 'limited': 3,
  'act now': 5, 'buy': 2, 'cheap': 3, 'credit': 3, 'loan': 3,
  'earn': 3, 'income': 3, 'investment': 3, 'million': 5, 'billion': 5,
  'guarantee': 4, 'risk free': 5, 'no cost': 4, 'viagra': 6, 'pills': 4,
  'pharmacy': 4, 'weight loss': 4, 'diet': 2, 'enlargement': 5,
  'casino': 5, 'betting': 4, 'lottery': 5, 'jackpot': 5,
  'nigerian': 5, 'prince': 4, 'inheritance': 5, 'transfer': 3,
  'bank account': 3, 'wire': 3, 'western union': 5,
  'unsubscribe': 2, 'opt out': 1, 'remove': 1,
  'reply': 1, 'forward': 1, 'txt': 2, 'text': 1,
  'call now': 4, 'toll free': 3, 'apply': 2,
  'congratulation': 5, 'selected': 3, 'awarded': 4,
  'expires': 3, 'hurry': 3, 'don\'t miss': 3, 'act immediately': 5,
  'as seen on': 3, 'click here': 4, 'click below': 4,
  'double your': 4, 'extra income': 4, 'online degree': 3,
  'work from home': 4, 'no experience': 3, 'be your own boss': 4,
};

const STOPWORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
  'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her',
  'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs',
  'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
  'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with',
  'about', 'against', 'between', 'through', 'during', 'before', 'after', 'above',
  'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under',
  'again', 'further', 'then', 'once',
]);

export interface ClassificationResult {
  label: 'spam' | 'ham';
  confidence: number;
  spamScore: number;
  features: FeatureAnalysis;
  processedText: string;
  tokens: string[];
}

export interface FeatureAnalysis {
  keywordsFound: { word: string; weight: number }[];
  capsRatio: number;
  exclamationCount: number;
  urlCount: number;
  numberCount: number;
  avgWordLength: number;
  messageLength: number;
  specialCharRatio: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

function extractFeatures(text: string): FeatureAnalysis {
  const lower = text.toLowerCase();
  const keywordsFound: { word: string; weight: number }[] = [];

  for (const [keyword, weight] of Object.entries(SPAM_KEYWORDS)) {
    if (lower.includes(keyword)) {
      keywordsFound.push({ word: keyword, weight });
    }
  }

  const upperChars = (text.match(/[A-Z]/g) || []).length;
  const alphaChars = (text.match(/[a-zA-Z]/g) || []).length;
  const capsRatio = alphaChars > 0 ? upperChars / alphaChars : 0;

  const exclamationCount = (text.match(/!/g) || []).length;
  const urlCount = (text.match(/https?:\/\/|www\.|\.com|\.net|\.org/gi) || []).length;
  const numberCount = (text.match(/\d+/g) || []).length;
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const avgWordLength = words.length > 0 ? words.reduce((s, w) => s + w.length, 0) / words.length : 0;
  const specialChars = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  const specialCharRatio = text.length > 0 ? specialChars / text.length : 0;

  return {
    keywordsFound,
    capsRatio,
    exclamationCount,
    urlCount,
    numberCount,
    avgWordLength,
    messageLength: text.length,
    specialCharRatio,
  };
}

export function classifyMessage(text: string): ClassificationResult {
  const tokens = tokenize(text);
  const features = extractFeatures(text);

  let score = 0;

  // Keyword scoring
  score += features.keywordsFound.reduce((s, k) => s + k.weight, 0);

  // Caps ratio bonus
  if (features.capsRatio > 0.5) score += 3;
  else if (features.capsRatio > 0.3) score += 1.5;

  // Exclamation marks
  score += Math.min(features.exclamationCount * 0.5, 3);

  // URLs
  score += features.urlCount * 1.5;

  // Numbers (phone numbers, amounts)
  if (features.numberCount > 3) score += 2;

  // Special chars
  if (features.specialCharRatio > 0.15) score += 1.5;

  // Short messages with spam keywords are suspicious
  if (features.messageLength < 50 && features.keywordsFound.length > 0) score += 2;

  // Normalize to 0-100
  const maxPossible = 40;
  const normalizedScore = Math.min((score / maxPossible) * 100, 100);
  const confidence = Math.min(Math.abs(normalizedScore - 50) * 2 + 50, 99);

  return {
    label: normalizedScore >= 30 ? 'spam' : 'ham',
    confidence: Math.round(confidence),
    spamScore: Math.round(normalizedScore),
    features,
    processedText: tokens.join(' '),
    tokens,
  };
}

export const SAMPLE_MESSAGES = [
  { text: "Hey, are we still meeting for lunch tomorrow? Let me know!", expected: 'ham' },
  { text: "CONGRATULATIONS! You've won a $1,000 Walmart gift card. Click here to claim NOW!", expected: 'spam' },
  { text: "Reminder: Your dentist appointment is scheduled for Thursday at 2pm.", expected: 'ham' },
  { text: "FREE entry in a weekly competition to win an iPad! Text WIN to 80085", expected: 'spam' },
  { text: "Can you pick up some milk on your way home? Thanks!", expected: 'ham' },
  { text: "URGENT! Your bank account has been compromised. Click this link immediately to verify your identity.", expected: 'spam' },
  { text: "The project deadline has been moved to next Friday. Please update your tasks accordingly.", expected: 'ham' },
  { text: "You have been selected for a $5,000 cash prize! Call now to claim your reward: 1-800-FREE-CASH", expected: 'spam' },
  { text: "Don't forget mom's birthday is next week. Should we plan a surprise party?", expected: 'ham' },
  { text: "Limited time offer!!! Buy 2 get 3 FREE! Hurry, this deal expires tonight! Click here!", expected: 'spam' },
  { text: "I've attached the quarterly report for your review. Let me know if you have questions.", expected: 'ham' },
  { text: "Dear friend, I am a Nigerian prince and I need your help transferring $10 million...", expected: 'spam' },
];
