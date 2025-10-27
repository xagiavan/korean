import React from 'react';

// From geminiService, srsService, etc.
export interface VocabItem {
    word: string;
    romanization: string;
    partOfSpeech: string;
    meaning: string;
    example_sentence: string;
    example_translation: string;
    // For SRS
    srsLevel?: number;
    nextReview?: string; // ISO date string
    lastReviewed?: string; // ISO date string
}

// From geminiService, Conversations
export interface ConversationLine {
    speaker: 'A' | 'B' | string;
    korean: string;
    romanization: string;
    vietnamese: string;
}

// From phraseData, geminiService
export interface Phrase {
  korean: string;
  romanization: string;
  vietnamese: string;
}

// From geminiService, Quiz
export interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    topic: string;
    correctWord?: string;
}

// From geminiService, MediaLearning
export interface MediaAnalysisVocab {
  word: string;
  meaning: string;
}

export interface MediaAnalysisGrammar {
  point: string;
  explanation: string;
}

export interface MediaAnalysisResult {
  vocabulary: MediaAnalysisVocab[];
  grammar: MediaAnalysisGrammar[];
}

export interface GrammarComponent {
    component: string;
    type: string;
    explanation: string;
}

// Generic chat message, for AiRolePlay, LiveTutor
export interface ChatMessage {
    role: 'user' | 'model' | 'system';
    parts: { text: string }[];
}

// From geminiService, AiRolePlay
export interface ScenarioTask {
    id: string;
    description: string;
}
export interface ScenarioMission {
    objective: string;
    tasks: ScenarioTask[];
    functionDeclarations: any[]; // Using any because FunctionDeclaration is complex
}
export interface Scenario {
    id: string;
    title: string;
    description: string;
    character: string;
    mission: ScenarioMission;
}

// From geminiService
export interface PerformanceReport {
    overallScore: number;
    positiveFeedback: string;
    improvementSuggestion: string;
    grammarFocus: {
        point: string;
        explanation: string;
    };
}

// From PronunciationPractice
export interface ShadowingReport {
  pronunciationScore: number;
  pronunciationFeedback: string;
  rhythmScore: number;
  rhythmFeedback: string;
  intonationScore: number;
  intonationFeedback: string;
  overallScore: number;
  overallFeedback: string;
}

// From PersonalizedPlan
export interface LearningStep {
    stepNumber: number;
    title: string;
    description: string;
    featureTarget: 'srs' | 'conversations' | 'roleplay' | 'quiz' | 'media' | 'grammarCurriculum' | 'grammarHelper' | 'grammarQuiz';
    targetTopic?: string;
    cta: string;
}
export type LearningPlan = LearningStep[];
export type DailyGoal = LearningStep;

export interface DailyDashboard {
  plan: LearningPlan;
  goal: DailyGoal;
}


// From geminiService
export interface WordExpansion {
    synonyms: string[];
    antonyms: string[];
}

// From geminiService, ImageRecognition
export interface IdentifiedObject {
    korean: string;
    romanization: string;
    vietnamese: string;
}

// From geminiService, for Landing Page Word of the Day
export interface VocabDetail {
    partOfSpeech: string;
    meaning: string;
    usage?: string;
}

export interface DetailedVocabItem {
    word: string;
    variations: string[];
    romanization: string;
    details: VocabDetail[];
    common_phrases: string[];
    example_sentence: string;
    example_translation: string;
}

// From statsService
export interface DailyStats {
    listened: number;
    tested: number;
}
export interface AppStats {
    today: DailyStats;
    thisMonth: DailyStats;
    lastUpdated: string; // YYYY-MM-DD
}

// From hangeulData, HandwritingPractice
export interface HangeulExample {
    word: string;
    romanization: string;
    meaning: string;
}
export interface Point {
    x: number;
    y: number;
    radius?: number;
}
export interface HangeulChar {
    char: string;
    name: string;
    romanization: string;
    strokes: Point[][];
    checkpoints: Point[][];
    pronunciationTip: string;
    writingRule: string;
    examples: HangeulExample[];
}
export interface HangeulCharGroup {
    title: string;
    chars: HangeulChar[];
}


// From translationHistoryService
export interface TranslationHistoryItem {
    id: string;
    inputText: string;
    fromLang: string;
    toLang: string;
    translation: string;
}

// From geminiService, Competition
export interface WeeklyQuest {
    id: string;
    title: string;
    description: string;
    xp: number;
    featureTarget: Feature;
}

export interface LeaderboardUser {
    rank: number;
    name: string;
    xp: number;
    isCurrentUser: boolean;
}

export interface League {
    id: 'bronze' | 'silver' | 'gold' | 'diamond';
    name: string;
    iconColor: string;
}


// From gamificationService
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.FC<any>;
    isUnlocked?: boolean;
}

export interface GamificationState {
    xp: number;
    level: number;
    streak: number;
    lastActivityDate: string; // YYYY-MM-DD
    unlockedBadgeIds: string[];
    uniqueDictionaryLookups: string[]; // Store unique words
    completedRolePlays: string[]; // Store unique scenario IDs
    completedQuizzesCount: number;
    createdConversationsCount: number;
    analyzedSentencesCount: number;
    grammarQuizStats: { [categoryId: string]: number; };
    completedQuestIds?: string[]; // Optional for backward compatibility
}


// From errorTrackingService
export interface ErrorStats {
    grammar: { [key: string]: number };
    vocab: { [key: string]: number };
}

// From mediaService
export interface LyricLine {
    timestamp: number;
    korean: string;
    romanization: string;
    vietnamese: string;
}
export interface MediaContent {
    id: string;
    type: 'audio' | 'video';
    category: 'conversation' | 'grammar';
    title: string;
    artistOrDrama: string;
    thumbnailUrl: string;
    audioUrl?: string;
    videoUrl?: string;
    lyrics: LyricLine[];
}

// From geminiService, HandwritingPractice
export interface HandwritingFeedback {
  score: number;
  positiveFeedback: string;
  improvementTip: string;
}

// From grammarReferenceData
export interface GrammarExample {
  korean: string;
  romanization: string;
  vietnamese: string;
}

export interface GrammarPoint {
  pattern: string;
  meaning: string;
  explanation: string;
  conjugation: string;
  examples: GrammarExample[];
  notes?: string;
  culturalNote?: string;
}

export interface GrammarCategoryData {
  categoryName: string;
  points: GrammarPoint[];
}

export interface GrammarLevel {
  levelName: 'Sơ cấp' | 'Trung cấp' | 'Cao cấp';
  levelId: 'beginner' | 'intermediate' | 'advanced';
  categories: GrammarCategoryData[];
}

// From geminiService, GrammarHelper
export interface GrammarExplanation {
  grammar_point: string;
  explanation: string;
  examples: GrammarExample[];
  common_mistakes?: string;
}

// From hanjaData, HanjaExplorer
export interface HanjaExampleWord {
  hanja: string;
  hangeul: string;
  romanization: string;
  meaning: string;
}

export interface HanjaChar {
  char: string;
  reading: string;
  meaning: string;
  strokeCount: number;
  radical: string;
  examples: HanjaExampleWord[];
  notes?: string;
}

export interface HanjaLevel {
  levelName: 'Sơ cấp' | 'Trung cấp' | 'Cao cấp';
  levelId: 'beginner' | 'intermediate' | 'advanced';
  chars: HanjaChar[];
}

// From geminiService, HanjaExplorer Mind Map
export interface HanjaMindMapNode {
  hanja: string;
  hangeul: string;
  romanization: string;
  vietnamese: string;
}

export interface HanjaMindMap {
  root: {
    char: string;
    reading: string;
    meaning: string;
  };
  nodes: HanjaMindMapNode[];
}


// From geminiService, LearningJournal
export interface JournalCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface JournalAnalysis {
  correctedText: string;
  corrections: JournalCorrection[];
  suggestion: string;
}

// From geminiService, StoryTime
export interface BilingualStorySegment {
  type: 'vietnamese' | 'korean';
  text: string;
  meaning?: string;
  romanization?: string;
  example_sentence?: string;
  example_translation?: string;
}
export interface BilingualStory {
    title: string;
    content: BilingualStorySegment[][];
}

// From learningHistoryService
export interface LearningHistoryItem {
    id: string; // ISO timestamp string
    type: 'vocab' | 'phrase' | 'grammar';
    content: VocabItem | Phrase | GrammarPoint;
}

export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  level: LearningLevel | null;
}


// App-level prop types
export type Feature = 'plan' | 'dictionary' | 'translator' | 'vocab' | 'srs' | 'conversations' | 'pronunciation' | 'handwriting' | 'journal' | 'quiz' | 'grammarQuiz' | 'settings' | 'upgrade' | 'media' | 'camera' | 'roleplay' | 'livetutor' | 'profile' | 'phrases' | 'grammarCurriculum' | 'grammarHelper' | 'hanja' | 'storytime' | 'admin' | 'add_word' | 'competition' | 'history';

export type ThemeSetting = 'light' | 'dark' | 'system';
export type SidebarModeSetting = 'pinned' | 'collapsible';
export type FontSizeSetting = 'sm' | 'base' | 'lg';

export interface AppSettings {
    theme: ThemeSetting;
    sidebarMode: SidebarModeSetting;
    fontSize: FontSizeSetting;
}

export interface AppFeatureProps {
  setActiveFeature: (feature: Feature, payload?: any) => void;
  payload?: any;
  settings?: AppSettings;
  setSettings?: React.Dispatch<React.SetStateAction<AppSettings>>;
}
