import React, { useState, useEffect } from 'react';
import { AppLogo, BrainCircuitIcon, SparklesIcon, ChatBubbleIcon, UserIcon, PlanIcon, SpeakerIcon, TrophyIcon } from './icons/Icons';
import PricingSection from './PricingSection';
import { getDetailedWordOfTheDay, generateLandingPageQuiz } from '../services/geminiService';
import type { DetailedVocabItem, QuizQuestion } from '../types';
import Loader from './Loader';

interface LandingPageProps {
  onGetStartedClick: () => void;
}

const Header: React.FC<{ onGetStartedClick: () => void; }> = ({ onGetStartedClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <AppLogo className="w-9 h-9" />
                    <span className="font-bold text-lg">Học Tiếng Hàn</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <a href="#features" className="hover:text-hanguk-blue-600 transition-colors">Tính năng</a>
                    <a href="#pricing" className="hover:text-hanguk-blue-600 transition-colors">Bảng giá</a>
                    <a href="#testimonials" className="hover:text-hanguk-blue-600 transition-colors">Học viên</a>
                </nav>
                <button onClick={onGetStartedClick} className="px-5 py-2 bg-hanguk-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-hanguk-blue-700 transition-all-base text-sm">
                    Bắt đầu
                </button>
            </div>
        </header>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm">
        <div className="mb-4 p-3 bg-hanguk-blue-100 dark:bg-hanguk-blue-900 rounded-full text-hanguk-blue-600 dark:text-hanguk-blue-300">
            {icon}
        </div>
        <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; role: string; }> = ({ quote, name, role }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <p className="text-slate-600 dark:text-slate-300 italic">"{quote}"</p>
        <p className="mt-4 font-bold text-right text-hanguk-blue-700 dark:text-hanguk-blue-300">- {name}, <span className="font-normal text-sm text-slate-500">{role}</span></p>
    </div>
);

const HowItWorksStep: React.FC<{ icon: React.ReactNode; step: string; title: string; description: string; }> = ({ icon, step, title, description }) => (
    <div className="relative bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md z-10 text-center flex flex-col items-center">
        <div className="mb-4 p-4 bg-hanguk-blue-100 dark:bg-hanguk-blue-900 rounded-full text-hanguk-blue-600 dark:text-hanguk-blue-300">
            {icon}
        </div>
        <span className="text-sm font-bold text-hanguk-blue-600 dark:text-hanguk-blue-400">{step}</span>
        <h3 className="text-lg font-bold my-2 text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
);

const FloatingChar: React.FC<{ char: string; className: string; animationDelay: string; }> = ({ char, className, animationDelay }) => (
    <div className={`absolute text-7xl font-bold text-hanguk-blue-100 dark:text-hanguk-blue-900/30 select-none opacity-70 ${className}`} style={{ animation: `float 6s ease-in-out infinite`, animationDelay }}>
        {char}
    </div>
);

const HandwritingDemo: React.FC<{ onGetStartedClick: () => void; }> = ({ onGetStartedClick }) => (
    <section className="py-20 md:py-28 bg-white dark:bg-slate-800/50">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 lg:w-5/12">
                    <div className="relative aspect-square bg-slate-100 dark:bg-slate-900/50 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
                        {/* Grid background */}
                        <svg width="100%" height="100%" className="absolute inset-0">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                                </pattern>
                                <pattern id="dark-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="1"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" className="dark:hidden" />
                            <rect width="100%" height="100%" fill="url(#dark-grid)" className="hidden dark:block" />
                        </svg>
                        
                        {/* Animated character '한' */}
                        <svg viewBox="0 0 200 200" className="relative z-10 w-full h-full">
                            <g fill="none" stroke="#4280f5" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
                                {/* ㅎ */}
                                <path className="handwriting-stroke stroke-1" d="M 50 45 h 30" />
                                <path className="handwriting-stroke stroke-2" d="M 40 65 h 50" />
                                <path className="handwriting-stroke stroke-3" d="M 85 90 A 20 20 0 1 0 45 90 A 20 20 0 1 0 85 90" />
                                {/* ㅏ */}
                                <path className="handwriting-stroke stroke-4" d="M 120 40 v 100" />
                                <path className="handwriting-stroke stroke-5" d="M 120 90 h 20" />
                                {/* ㄴ (patchim) */}
                                <path className="handwriting-stroke stroke-6" d="M 40 150 v 20 h 100" />
                            </g>
                        </svg>
                    </div>
                </div>
                <div className="md:w-1/2 lg:w-7/12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Viết Đúng, Nhớ Lâu</h2>
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                        Tính năng luyện viết tay sẽ hướng dẫn bạn từng nét chữ Hangeul. AI sẽ kiểm tra thứ tự và hướng viết của bạn, giúp bạn xây dựng nền tảng vững chắc và ghi nhớ mặt chữ hiệu quả.
                    </p>
                    <button onClick={onGetStartedClick} className="mt-8 px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 transition-transform hover:scale-105">
                        Thử viết ngay
                    </button>
                </div>
            </div>
        </div>
    </section>
);

const TutorShowcase: React.FC = () => (
    <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Luyện Nói Không Ngại Sai</h2>
            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Thực hành các tình huống giao tiếp thực tế với gia sư AI. Nhận phản hồi tức thì về phát âm và ngữ pháp để bạn tự tin hơn mỗi ngày.
            </p>
            <div className="max-w-2xl mx-auto mt-12">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 text-left space-y-4">
                    {/* Dialogue bubbles */}
                    <div className="flex items-start gap-3 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <div className="w-10 h-10 rounded-full bg-hanguk-blue-100 dark:bg-hanguk-blue-900 flex items-center justify-center font-bold text-hanguk-blue-600 dark:text-hanguk-blue-300 flex-shrink-0">AI</div>
                        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
                            <p>Chào bạn! Hôm nay bạn muốn luyện tập tình huống nào?</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 justify-end animate-fade-in-up" style={{animationDelay: '1s'}}>
                        <div className="p-3 rounded-lg bg-hanguk-blue-600 text-white">
                            <p>Tôi muốn gọi món ở nhà hàng.</p>
                        </div>
                         <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0"><UserIcon className="w-6 h-6" /></div>
                    </div>
                    <div className="flex items-start gap-3 animate-fade-in-up" style={{animationDelay: '2s'}}>
                         <div className="w-10 h-10 rounded-full bg-hanguk-blue-100 dark:bg-hanguk-blue-900 flex items-center justify-center font-bold text-hanguk-blue-600 dark:text-hanguk-blue-300 flex-shrink-0">AI</div>
                        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
                            <p>Tuyệt vời! Hãy bắt đầu. Bạn là khách hàng nhé. <strong>어서 오세요!</strong></p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 justify-end animate-fade-in-up" style={{animationDelay: '3s'}}>
                        <div className="p-3 rounded-lg bg-hanguk-blue-600 text-white">
                            <p><strong>김치찌개 하나 주세요.</strong></p>
                        </div>
                         <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0"><UserIcon className="w-6 h-6" /></div>
                    </div>
                     <div className="flex items-start gap-3 animate-fade-in-up" style={{animationDelay: '4s'}}>
                         <div className="w-10 h-10 rounded-full bg-hanguk-blue-100 dark:bg-hanguk-blue-900 flex items-center justify-center font-bold text-hanguk-blue-600 dark:text-hanguk-blue-300 flex-shrink-0">AI</div>
                        <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                            <p>Rất tốt! Phát âm của bạn rất rõ ràng. Giờ hãy thử hỏi giá tiền nhé.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const WordOfTheDaySection: React.FC = () => {
    const [word, setWord] = useState<DetailedVocabItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWord = async () => {
            setIsLoading(true);
            const response = await getDetailedWordOfTheDay();
            setWord(response.item); // Always set the word from either API or sample data
            // FIX: Don't show API errors to visitors on the landing page. It should always fall back to sample data smoothly.
            // The "No Gemini API keys" error is expected, so we no longer log it as a warning.
            setIsLoading(false);
        };
        fetchWord();
    }, []);

    const speak = (text: string) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <section className="py-20 md:py-28 bg-hanguk-blue-50 dark:bg-slate-800">
            <div className="container mx-auto px-6">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Thử một chút chức năng AI</h2>
                    <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Đây là "Từ vựng của ngày" được phân tích sâu bởi Gia sư AI của chúng tôi.</p>
                </div>

                <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg border border-hanguk-blue-100 dark:border-hanguk-blue-900 relative">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48"><Loader /></div>
                    ) : word ? (
                        <div>
                             <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                <div>
                                    <p className="font-semibold text-sm text-hanguk-blue-600 dark:text-hanguk-blue-400">TỪ VỰNG CỦA NGÀY</p>
                                    <h3 className="text-4xl font-bold text-hanguk-blue-800 dark:text-hanguk-blue-300 mt-1">{word.word}
                                        {word.variations && word.variations.length > 0 && <span className="text-2xl text-slate-500 font-normal"> / {word.variations.join(', ')}</span>}
                                    </h3>
                                    <p className="text-lg text-slate-500 italic">{word.romanization}</p>
                                </div>
                                <button onClick={() => speak(word.word)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"><SpeakerIcon /></button>
                            </div>

                            <div className="space-y-4">
                                {word.details.map((detail, index) => (
                                    <div key={index}>
                                        <p className="font-semibold"><span className="text-sm bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded-md px-2 py-0.5">{detail.partOfSpeech}</span></p>
                                        <p className="mt-1 text-slate-700 dark:text-slate-300">{detail.meaning}</p>
                                        {detail.usage && <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1">Lưu ý: {detail.usage}</p>}
                                    </div>
                                ))}

                                {word.common_phrases && word.common_phrases.length > 0 && (
                                    <div>
                                        <p className="font-semibold">Cụm từ phổ biến:</p>
                                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">
                                            {word.common_phrases.map((phrase, i) => <li key={i}>{phrase}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <p className="font-semibold">Ví dụ:</p>
                                <p className="text-lg">{word.example_sentence}</p>
                                <p className="text-slate-500">"{word.example_translation}"</p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
};

const MiniQuizSection: React.FC<{ onGetStartedClick: () => void; }> = ({ onGetStartedClick }) => {
    const [quizState, setQuizState] = useState<'idle' | 'loading' | 'active' | 'finished'>('idle');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);

    const startQuiz = async () => {
        setQuizState('loading');
        const quizQuestions = await generateLandingPageQuiz();
        setQuestions(quizQuestions);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setScore(0);
        setQuizState('active');
    };
    
    const handleAnswer = (answer: string) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        if (answer === questions[currentQuestionIndex].answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsAnswered(false);
            setSelectedAnswer(null);
        } else {
            setQuizState('finished');
        }
    };
    
    const renderContent = () => {
        switch (quizState) {
            case 'loading':
                return <div className="h-64 flex items-center justify-center"><Loader /></div>;
            case 'active':
                const question = questions[currentQuestionIndex];
                return (
                    <div className="animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{question.topic}</h4>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Câu {currentQuestionIndex + 1} / {questions.length}</p>
                        </div>
                        <p className="text-xl font-semibold mb-6 min-h-[56px]">{question.question}</p>
                        <div className="space-y-3">
                            {(question.options || []).map(option => {
                                let buttonClass = "w-full p-3 text-left border-2 rounded-lg font-semibold transition-colors ";
                                if (isAnswered) {
                                    if (option === question.answer) {
                                        buttonClass += "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-600 dark:text-green-300";
                                    } else if (option === selectedAnswer) {
                                        buttonClass += "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-600 dark:text-red-300";
                                    } else {
                                        buttonClass += "border-slate-300 dark:border-slate-600 opacity-60";
                                    }
                                } else {
                                    buttonClass += "border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700";
                                }

                                return (
                                    <button key={option} onClick={() => handleAnswer(option)} disabled={isAnswered} className={buttonClass}>
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                        {isAnswered && (
                            <div className="text-right mt-6">
                                <button onClick={handleNext} className="px-6 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700">
                                    {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 'finished':
                const resultMessage = score > 1 ? "Bạn có nền tảng rất tốt! Sẵn sàng để chinh phục những kiến thức cao hơn." : "Bạn là người mới bắt đầu! Đây là nơi hoàn hảo để xây dựng nền tảng vững chắc.";
                return (
                    <div className="text-center animate-fade-in-up flex flex-col items-center">
                        <TrophyIcon className="w-16 h-16 text-yellow-500 mb-4" />
                        <h4 className="text-2xl font-bold">Hoàn thành!</h4>
                        <p className="text-4xl font-bold my-3 text-hanguk-blue-600 dark:text-hanguk-blue-400">{score} / {questions.length}</p>
                        <p className="text-slate-600 dark:text-slate-300 max-w-sm mx-auto mb-6">{resultMessage}</p>
                        <button onClick={onGetStartedClick} className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-transform hover:scale-105">
                            Xem Lộ trình học cá nhân hóa
                        </button>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div className="text-center animate-fade-in-up">
                        <button onClick={startQuiz} className="px-8 py-4 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-hanguk-blue-700 transition-transform hover:scale-105">
                            Bắt đầu bài kiểm tra
                        </button>
                    </div>
                );
        }
    };

    return (
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-6">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Kiểm tra trình độ của bạn trong 1 phút</h2>
                    <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Trả lời 3 câu hỏi nhanh để xem bạn đang ở đâu trên hành trình chinh phục tiếng Hàn.</p>
                </div>
                <div className="max-w-xl mx-auto bg-white dark:bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    {renderContent()}
                </div>
            </div>
        </section>
    );
};


const LandingPage: React.FC<LandingPageProps> = ({ onGetStartedClick }) => {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 overflow-x-hidden">
            <Header onGetStartedClick={onGetStartedClick} />

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 text-center bg-white dark:bg-slate-800/50 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-200/[0.4] dark:bg-grid-slate-700/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
                    
                    {/* Floating characters */}
                    <FloatingChar char="ㄱ" className="top-[15%] left-[10%]" animationDelay="0s" />
                    <FloatingChar char="ㅏ" className="top-[20%] right-[12%]" animationDelay="1s" />
                    <FloatingChar char="ㄴ" className="top-[60%] right-[20%]" animationDelay="2s" />
                    <FloatingChar char="ㄷ" className="bottom-[10%] left-[15%]" animationDelay="3s" />
                    <FloatingChar char="ㅗ" className="bottom-[25%] right-[30%]" animationDelay="4s" />
                    <FloatingChar char="ㅎ" className="top-[55%] left-[25%]" animationDelay="0.5s" />

                    <div className="container mx-auto px-6 relative z-10">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Chinh Phục Tiếng Hàn Cùng <br />
                            <span className="text-hanguk-blue-600">Gia Sư AI</span> Cá Nhân
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-500 dark:text-slate-400 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            Không chỉ là một ứng dụng, đây là lộ trình học tập, đối tác trò chuyện và gia sư riêng, luôn sẵn sàng 24/7 để giúp bạn giao tiếp tự tin.
                        </p>
                        <button onClick={onGetStartedClick} className="px-8 py-4 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-hanguk-blue-700 transition-transform hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                            Bắt đầu học miễn phí
                        </button>
                    </div>
                </section>
                
                {/* Why Different Section */}
                <section id="features" className="py-20 md:py-28">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Học thông minh hơn, không chỉ chăm hơn</h2>
                            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">AI của chúng tôi tạo ra một trải nghiệm học tập độc đáo không giống bất cứ đâu.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={<BrainCircuitIcon className="w-8 h-8"/>} 
                                title="Lộ Trình 'Đo Ni Đóng Giày'" 
                                description="AI phân tích điểm yếu của bạn để tạo ra kế hoạch học tập độc nhất mỗi ngày, giúp bạn tập trung vào những gì quan trọng nhất." 
                            />
                             <FeatureCard 
                                icon={<SparklesIcon className="w-8 h-8"/>} 
                                title="Nội Dung Học Vô Hạn" 
                                description="Tạo hội thoại, bài quiz, tình huống thực hành theo bất kỳ chủ đề nào bạn muốn. Việc học sẽ không bao giờ nhàm chán." 
                            />
                             <FeatureCard 
                                icon={<ChatBubbleIcon className="w-8 h-8"/>} 
                                title="Luyện Nói Mọi Lúc, Mọi Nơi" 
                                description="Trò chuyện trực tiếp với Gia sư AI để cải thiện phát âm và phản xạ mà không sợ bị phán xét." 
                            />
                        </div>
                    </div>
                </section>

                <HandwritingDemo onGetStartedClick={onGetStartedClick} />

                <TutorShowcase />
                
                <WordOfTheDaySection />
                
                <MiniQuizSection onGetStartedClick={onGetStartedClick} />

                {/* How it works Section */}
                <section className="py-20 md:py-28 bg-slate-100 dark:bg-slate-900/50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Bắt đầu chỉ trong 3 bước đơn giản</h2>
                            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Hành trình chinh phục tiếng Hàn của bạn chưa bao giờ dễ dàng hơn.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
                            <div className="absolute top-12 left-0 w-full h-px border-t-2 border-dashed border-slate-300 dark:border-slate-600 hidden md:block" aria-hidden="true"></div>
                            
                            <HowItWorksStep
                                icon={<UserIcon className="w-8 h-8" />}
                                step="Bước 1"
                                title="Đăng ký & Đặt mục tiêu"
                                description="Tạo tài khoản miễn phí và cho chúng tôi biết trình độ cũng như mục tiêu học tập của bạn."
                            />
                            <HowItWorksStep
                                icon={<PlanIcon className="w-8 h-8" />}
                                step="Bước 2"
                                title="Nhận Lộ trình Hàng ngày"
                                description="Mỗi ngày, AI sẽ tạo ra một kế hoạch học tập được cá nhân hóa dành riêng cho bạn."
                            />
                            <HowItWorksStep
                                icon={<SparklesIcon className="w-8 h-8" />}
                                step="Bước 3"
                                title="Học & Luyện tập"
                                description="Hoàn thành các bài học tương tác, thực hành giao tiếp và theo dõi sự tiến bộ của bạn."
                            />
                        </div>
                    </div>
                </section>

                 {/* Testimonials Section */}
                <section id="testimonials" className="py-20 md:py-28">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Học viên nói gì về chúng tôi</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                             <TestimonialCard name="Minh Anh" role="Sinh viên" quote="Trước đây em rất sợ học tiếng Hàn một mình. Giờ đây với lộ trình mỗi ngày, em biết chính xác mình cần làm gì và tiến bộ rất nhanh!" />
                             <TestimonialCard name="Hoàng Long" role="Nhân viên văn phòng" quote="Tôi biết nhiều ngữ pháp nhưng không thể nói được. Tính năng Nhập vai AI đã thay đổi hoàn toàn điều đó. Giờ tôi tự tin hơn nhiều khi giao tiếp." />
                             <TestimonialCard name="Ngọc Bích" role="Fan K-pop" quote="Tính năng học qua media thật tuyệt vời! Cuối cùng tôi cũng hiểu được lời bài hát của idol mà không cần chờ Vietsub." />
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20 md:py-28 bg-white dark:bg-slate-800/50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Mở khóa toàn bộ tiềm năng</h2>
                            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Chọn một gói phù hợp với hành trình chinh phục tiếng Hàn của bạn.</p>
                        </div>
                         <PricingSection onSelectPlan={onGetStartedClick} />
                    </div>
                </section>
                
                 {/* Final CTA Section */}
                <section className="py-20 md:py-28 text-center">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">Sẵn sàng trò chuyện tự tin bằng tiếng Hàn?</h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">Hành trình ngàn dặm bắt đầu bằng một bước chân. Hãy bắt đầu bước chân đầu tiên của bạn ngay hôm nay.</p>
                        <button onClick={onGetStartedClick} className="px-8 py-4 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-hanguk-blue-700 transition-transform hover:scale-105">
                            Bắt đầu hành trình của bạn
                        </button>
                    </div>
                </section>
            </main>

             {/* Footer */}
            <footer className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-6 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    <p>&copy; {new Date().getFullYear()} Korean Learning Hub. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;