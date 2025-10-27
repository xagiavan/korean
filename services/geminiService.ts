




import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Content, FunctionDeclaration, GenerateContentResponse, Type } from "@google/genai";
import type {
  VocabItem,
  ConversationLine,
  QuizQuestion,
  MediaAnalysisResult,
  GrammarComponent,
  ChatMessage,
  Scenario,
  PerformanceReport,
  ShadowingReport,
  LearningPlan,
  DailyDashboard,
  IdentifiedObject,
  DetailedVocabItem,
  GrammarExample,
  GrammarExplanation,
  HanjaExampleWord,
  HanjaMindMap,
  BilingualStory,
  BilingualStorySegment,
  LyricLine,
  Phrase,
  WeeklyQuest,
  HandwritingFeedback,
  JournalAnalysis
} from '../types';

// Mock AI client initialization
const getAiClient = () => {
    if (process.env.API_KEY) {
        return new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return null;
}

// --- SAMPLE DATA ---

export const sampleTopikVocab: VocabItem[] = [
  { word: '가족', romanization: 'gajok', partOfSpeech: 'Danh từ', meaning: 'gia đình', example_sentence: '우리 가족은 모두 다섯 명이에요.', example_translation: 'Gia đình tôi có tất cả 5 người.' },
  { word: '공부하다', romanization: 'gongbuhada', partOfSpeech: 'Động từ', meaning: 'học', example_sentence: '저는 한국어를 공부해요.', example_translation: 'Tôi học tiếng Hàn.' },
];

export const sampleConversation = {
  title: 'Tại quán cà phê (Mẫu)',
  conversation: [
    { speaker: 'A', korean: '안녕하세요! 뭐 드시겠어요?', romanization: 'Annyeonghaseyo! Mwo deusigesseoyo?', vietnamese: 'Xin chào! Quý khách muốn dùng gì ạ?' },
    { speaker: 'B', korean: '아이스 아메리카노 한 잔 주세요.', romanization: 'Aiseu amerikano han jan juseyo.', vietnamese: 'Cho tôi một ly Americano đá.' },
  ],
};

export const sampleQuiz: QuizQuestion[] = [
    { question: '"사과" có nghĩa là gì?', options: ['Quả táo', 'Quả chuối', 'Quả nho'], answer: 'Quả táo', explanation: '사과 (sagwa) có nghĩa là quả táo trong tiếng Hàn.', topic: 'Trái cây' }
];

export const sampleBilingualStory: BilingualStory = {
    title: 'Chú Mèo Đi Lạc (Mẫu)',
    content: [
        [
            { type: 'vietnamese', text: 'Ngày xửa ngày xưa, có một ' },
            { type: 'korean', text: '고양이', meaning: 'con mèo', romanization: 'goyangi', example_sentence: '고양이가 귀여워요.', example_translation: 'Con mèo dễ thương.' },
            { type: 'vietnamese', text: ' tên là Nabi. Nabi rất thích khám phá thế giới xung quanh.' },
        ],
        [
            { type: 'vietnamese', text: 'Một hôm, Nabi đi quá xa nhà và bị lạc. Cậu ấy cảm thấy rất ' },
            { type: 'korean', text: '무서웠어요', meaning: 'đã sợ hãi', romanization: 'museowosseoyo', example_sentence: '저는 어둠이 무서워요.', example_translation: 'Tôi sợ bóng tối.' },
            { type: 'vietnamese', text: '.' },
        ]
    ]
};

export const sampleGrammarExplanation: GrammarExplanation = {
    grammar_point: '-고 싶다',
    explanation: 'Cấu trúc này được gắn vào sau động từ để diễn tả mong muốn của người nói. Nó tương đương với "muốn..." trong tiếng Việt.',
    examples: [{ korean: '저는 영화를 보고 싶어요.', romanization: 'Jeoneun yeonghwa-reul bogo sipeoyo.', vietnamese: 'Tôi muốn xem phim.' }],
    common_mistakes: 'Không dùng cấu trúc này để nói về mong muốn của người thứ ba. Thay vào đó, hãy dùng "-고 싶어하다".'
};

export const sampleDailyDashboard: DailyDashboard = {
    plan: [
        { stepNumber: 1, title: "Ôn tập 10 từ vựng", description: "Bắt đầu ngày mới bằng việc củng cố các từ đã học.", featureTarget: 'srs', cta: "Ôn tập ngay" },
        { stepNumber: 2, title: "Luyện hội thoại", description: "Thực hành một đoạn hội thoại về chủ đề 'Đi nhà hàng'.", featureTarget: 'conversations', targetTopic: "Đi nhà hàng", cta: "Bắt đầu hội thoại" },
        { stepNumber: 3, title: "Kiểm tra nhanh", description: "Làm một bài quiz ngắn để kiểm tra kiến thức.", featureTarget: 'quiz', cta: "Làm bài quiz" },
    ],
    goal: { stepNumber: 1, title: "Ôn tập 10 từ vựng", description: "Bắt đầu ngày mới bằng việc củng cố các từ đã học.", featureTarget: 'srs', cta: "Ôn tập ngay" }
};

export const sampleUsageExamples: GrammarExample[] = [
  { korean: '저는 매일 운동해요.', romanization: 'jeoneun maeil undonghaeyo', vietnamese: 'Tôi tập thể dục mỗi ngày.' }
];

export const sampleGrammarPointQuiz: QuizQuestion[] = [
    { question: 'Điền vào chỗ trống: 저는 영화를 보___ 싶어요.', options: ['고', '서', '면'], answer: '고', explanation: 'Cấu trúc "muốn làm gì" là V-고 싶다.', topic: '-고 싶다' }
];

export const sampleHanjaMindMap: HanjaMindMap = {
    root: { char: '學', reading: '학', meaning: 'Học' },
    nodes: [
        { hanja: '學生', hangeul: '학생', romanization: 'haksaeng', vietnamese: 'Học sinh' },
        { hanja: '學校', hangeul: '학교', romanization: 'hakgyo', vietnamese: 'Trường học' },
    ]
};

export const scenarios: Scenario[] = [
  { id: 'restaurant_order', title: 'Đặt món ở nhà hàng', description: 'Bạn là một du khách và cần gọi món ăn tại một nhà hàng Hàn Quốc.', character: 'nhân viên phục vụ thân thiện', mission: { objective: 'Gọi thành công một món chính, một món phụ và một đồ uống.', tasks: [{id: 'order_main', description: 'Gọi món chính'}, {id: 'order_side', description: 'Gọi món phụ'}, {id: 'order_drink', description: 'Gọi đồ uống'}], functionDeclarations: [] } },
  // More scenarios...
];

// --- MOCK API FUNCTIONS ---

interface EvaluationResult {
    score: number;
    feedback: string;
}

export const translateText = async (text: string, from: string, to: string): Promise<{ translation: string; romanization: string; }> => {
    return { translation: `[Dịch mẫu] ${text}`, romanization: `[Phiên âm mẫu] ${text}` };
};

export const lookupDictionaryWord = async (word: string): Promise<VocabItem> => {
    return { word, romanization: 'romaja', partOfSpeech: 'Danh từ', meaning: 'Nghĩa mẫu', example_sentence: 'Câu ví dụ mẫu.', example_translation: 'Dịch câu ví dụ mẫu.' };
};

export const getAutocompleteSuggestions = async (query: string): Promise<string[]> => {
    return [`${query} suggestion 1`, `${query} suggestion 2`];
};

export const getTopikVocab = async (level: string): Promise<{ list: VocabItem[]; isSuccess: boolean; errorMessage?: string }> => {
    return { list: sampleTopikVocab, isSuccess: true };
};

export const generateMnemonic = async (word: string, meaning: string): Promise<string> => {
    return `[Mẹo ghi nhớ mẫu] cho từ "${word}" (${meaning}).`;
};

export const getSampleConversation = async (topic: string): Promise<{ title: string; conversation: ConversationLine[]; }> => {
    return { ...sampleConversation, title: `${topic} (Mẫu)` };
};

export const getConversationSuggestions = async (topic: string): Promise<{ topic: string; description: string; }[]> => {
    return [{ topic: 'Chủ đề gợi ý', description: 'Mô tả gợi ý' }];
};

export const evaluatePronunciation = async (korean: string, transcript: string): Promise<EvaluationResult> => {
    const score = transcript === korean ? 10 : Math.floor(Math.random() * 8);
    return { score, feedback: `[Phản hồi mẫu] Điểm của bạn là ${score}.` };
};

export const evaluateShadowing = async (korean: string, transcript: string): Promise<ShadowingReport> => {
    return { pronunciationScore: 85, pronunciationFeedback: 'Tốt', rhythmScore: 75, rhythmFeedback: 'Khá', intonationScore: 80, intonationFeedback: 'Ổn', overallScore: 80, overallFeedback: 'Làm tốt lắm!' };
};

export const generateQuiz = async (level: string, type: string, difficulty?: string): Promise<{ questions: QuizQuestion[]; isSuccess: boolean; errorMessage?: string; }> => {
    return { questions: sampleQuiz, isSuccess: true };
};

export const generatePersonalizedQuiz = async (errors: { grammar: string[], vocab: string[] }): Promise<{ questions: QuizQuestion[]; isSuccess: boolean; errorMessage?: string; }> => {
    return { questions: sampleQuiz, isSuccess: true };
};

export const getHandwritingFeedback = async (base64Image: string, mimeType: string, character: string): Promise<HandwritingFeedback> => {
    return { score: 8, positiveFeedback: '[Phản hồi mẫu] Nét chữ rõ ràng.', improvementTip: '[Góp ý mẫu] Hãy chú ý hơn đến thứ tự nét bút.' };
};

export const analyzeGrammar = async (koreanSentence: string): Promise<GrammarComponent[]> => {
    return [{ component: '-고 싶다', type: 'Ngữ pháp', explanation: 'Diễn tả mong muốn.' }];
};

export const analyzeMediaTranscript = async (transcript: string): Promise<MediaAnalysisResult> => {
    return { vocabulary: [{ word: '단어', meaning: 'từ vựng' }], grammar: [{ point: '-은/는', explanation: 'trợ từ chủ đề' }] };
};

export const generateLyricsFromTranscript = async (transcript: string): Promise<LyricLine[]> => {
    const lines = transcript.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => ({
        timestamp: index * 5,
        korean: line,
        romanization: `[romaja for ${line}]`,
        vietnamese: `[dịch cho ${line}]`
    }));
};

export const startAiRolePlay = async (title: string, character: string): Promise<{ greeting: string; characterDescription: string; }> => {
    return { greeting: '안녕하세요! [Lời chào mẫu]', characterDescription: character };
};

export const generateRolePlayResponse = async (history: Content[], character: string, tools: any[]): Promise<{ text: string, functionCalls?: any[] }> => {
    return { text: '[Phản hồi mẫu từ AI]' };
};

export const analyzeConversationPerformance = async (messages: ChatMessage[]): Promise<PerformanceReport> => {
    return { overallScore: 85, positiveFeedback: '[Phản hồi tích cực mẫu]', improvementSuggestion: '[Góp ý mẫu]', grammarFocus: { point: '-은/는', explanation: 'Giải thích mẫu' } };
};

export const getDetailedWordOfTheDay = async (): Promise<{ item: DetailedVocabItem; isSuccess: boolean }> => {
    return {
        item: {
            word: '약속', variations: [], romanization: 'yaksok',
            details: [{ partOfSpeech: 'Danh từ', meaning: 'lời hứa, cuộc hẹn' }],
            common_phrases: ['약속을 지키다 (giữ lời hứa)'],
            example_sentence: '친구하고 영화를 보기로 약속했어요.',
            example_translation: 'Tôi đã hẹn đi xem phim với bạn.'
        },
        isSuccess: true,
    };
};

export const generateDailyDashboardData = async (srsCount: number, commonErrors: { grammar: string[], vocab: string[] }): Promise<{ dashboard: DailyDashboard; isSuccess: boolean; errorMessage?: string; }> => {
    return { dashboard: sampleDailyDashboard, isSuccess: true };
};

export const identifyObjectsInImage = async (base64Data: string, mimeType: string): Promise<IdentifiedObject[]> => {
    return [{ korean: '사과', romanization: 'sagwa', vietnamese: 'quả táo' }];
};

export const analyzeJournalEntry = async (content: string): Promise<JournalAnalysis> => {
    return {
        correctedText: `[Bản sửa mẫu] ${content}`,
        corrections: [{ original: '틀린 것', corrected: '맞는 것', explanation: 'Giải thích mẫu' }],
        suggestion: 'Gợi ý văn phong mẫu.'
    };
};

export const generateVocabItemForText = async (text: string): Promise<VocabItem | null> => {
    if (!text) return null;
    return {
        word: text,
        romanization: `[romaja]`,
        meaning: `[meaning]`,
        partOfSpeech: 'Danh từ',
        example_sentence: `Câu ví dụ với ${text}.`,
        example_translation: `Dịch câu ví dụ.`
    };
};

export const generateBilingualStory = async (genre: string, plot: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<{ story: BilingualStory | null; isSuccess: boolean; errorMessage?: string; }> => {
    return { story: sampleBilingualStory, isSuccess: true };
};

export const getMoreHanjaWords = async (char: string, reading: string, meaning: string): Promise<HanjaExampleWord[]> => {
    return [{ hanja: `例${char}`, hangeul: `예${reading}`, romanization: `ye${reading}`, meaning: 'Ví dụ' }];
};

export const generateHanjaMindMap = async (char: string, reading: string, meaning: string): Promise<{ mindMap: HanjaMindMap | null; isSuccess: boolean; errorMessage?: string; }> => {
    return { mindMap: sampleHanjaMindMap, isSuccess: true };
};

export const generatePhrasesForSituation = async (situation: string): Promise<Phrase[]> => {
    return [{ korean: '이거 주세요.', romanization: 'igeo juseyo', vietnamese: 'Cho tôi cái này.' }];
};

export const generateWeeklyQuests = async (context: string): Promise<{ quests: WeeklyQuest[]; isSuccess: boolean; errorMessage?: string; }> => {
    return {
        quests: [
            { id: 'q1', title: 'Ôn tập 15 từ vựng', description: 'Sử dụng tính năng SRS để củng cố kiến thức.', xp: 100, featureTarget: 'srs' },
            { id: 'q2', title: 'Luyện 1 hội thoại', description: 'Tạo và luyện tập một hội thoại với AI.', xp: 150, featureTarget: 'conversations' },
        ],
        isSuccess: true,
    };
};

export const generateLandingPageQuiz = async (): Promise<QuizQuestion[]> => {
    return sampleQuiz;
};

export const generateGrammarPointQuiz = async (pattern: string, explanation: string): Promise<{ questions: QuizQuestion[]; isSuccess: boolean; errorMessage?: string; }> => {
    return { questions: sampleGrammarPointQuiz, isSuccess: true };
};

export const generateUsageExamples = async (query: string): Promise<GrammarExample[]> => {
    return sampleUsageExamples;
};

export const explainGrammarPoint = async (query: string): Promise<GrammarExplanation | null> => {
    return sampleGrammarExplanation;
};