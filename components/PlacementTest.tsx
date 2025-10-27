import React, { useState } from 'react';
import type { QuizQuestion, LearningLevel } from '../types';
import Loader from './Loader';
import { BrainCircuitIcon } from './icons/Icons';

const placementQuestions: QuizQuestion[] = [
    {
        question: 'Điền vào chỗ trống: "저는 베트남 사람___."',
        options: ['예요', '이에요', '가 아니에요', '은'],
        answer: '이에요',
        explanation: 'Danh từ "사람" kết thúc bằng phụ âm, vì vậy ta dùng "이에요".',
        topic: 'Cấu trúc câu cơ bản',
    },
    {
        question: 'Chọn dạng quá khứ đúng của động từ "보다" (xem).',
        options: ['봐요', '보어요', '봤어요', '보했어요'],
        answer: '봤어요',
        explanation: 'Nguyên âm "오" kết hợp với "았어요" để tạo thành thì quá khứ "봤어요".',
        topic: 'Thì quá khứ',
    },
    {
        question: 'Điền vào chỗ trống: "날씨가 좋___ 공원에 갑시다." (Thời tiết đẹp nên chúng ta hãy ra công viên đi).',
        options: ['좋아서', '좋으니까', '좋고', '좋지만'],
        answer: '좋으니까',
        explanation: 'Khi mệnh đề sau là một câu rủ rê ("-ㅂ시다"), ta phải dùng `~(으)니까` để chỉ lý do.',
        topic: 'Nguyên nhân',
    },
    {
        question: 'Chuyển câu sau sang dạng gián tiếp: "수진 씨가 말했어요: 저는 학생이에요."',
        options: ['수진 씨가 학생이라고 했어요.', '수진 씨가 학생는다고 했어요.', '수진 씨가 학생이냐고 했어요.', '수진 씨가 학생자고 했어요.'],
        answer: '수진 씨가 학생이라고 했어요.',
        explanation: 'Câu trần thuật với danh từ được thuật lại bằng cấu trúc "Danh từ + -(이)라고 하다".',
        topic: 'Tường thuật gián tiếp',
    },
    {
        question: 'Chọn cấu trúc đúng: "그렇게 서두르면 실수하기 ___." (Nếu cứ vội vàng như vậy thì dễ mắc lỗi lắm).',
        options: ['나름이다', '십상이다', '마련이다', '따름이다'],
        answer: '십상이다',
        explanation: '"-기 십상이다" là cấu trúc cao cấp dùng để dự đoán một kết quả xấu có khả năng cao sẽ xảy ra.',
        topic: 'Cấu trúc nâng cao',
    },
];

interface PlacementTestProps {
    onComplete: (level: LearningLevel) => void;
}

const PlacementTest: React.FC<PlacementTestProps> = ({ onComplete }) => {
    const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(string | null)[]>(Array(placementQuestions.length).fill(null));
    const [score, setScore] = useState(0);
    const [determinedLevel, setDeterminedLevel] = useState<LearningLevel>('beginner');

    const handleAnswer = (answer: string) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);

        // Move to next question automatically after a short delay
        setTimeout(() => {
            if (currentQuestionIndex < placementQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                calculateResult(newAnswers);
            }
        }, 300);
    };
    
    const calculateResult = (finalAnswers: (string | null)[]) => {
        let correctCount = 0;
        finalAnswers.forEach((answer, index) => {
            if (answer === placementQuestions[index].answer) {
                correctCount++;
            }
        });
        
        setScore(correctCount);

        let level: LearningLevel = 'beginner';
        if (correctCount >= 4) {
            level = 'advanced';
        } else if (correctCount >= 2) {
            level = 'intermediate';
        }
        setDeterminedLevel(level);
        setStep('result');
    };

    const renderIntro = () => (
        <div className="text-center">
            <div className="mx-auto mb-6 p-4 bg-hanguk-blue-100 dark:bg-hanguk-blue-900 rounded-full inline-block">
                <BrainCircuitIcon className="w-12 h-12 text-hanguk-blue-600 dark:text-hanguk-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Kiểm tra trình độ nhanh</h1>
            <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Chào mừng bạn! Hãy trả lời 5 câu hỏi ngắn để chúng tôi có thể cá nhân hóa lộ trình học tập phù hợp nhất với bạn.
            </p>
            <button
                onClick={() => setStep('quiz')}
                className="mt-8 w-full sm:w-auto px-8 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 transition-colors"
            >
                Bắt đầu
            </button>
        </div>
    );
    
    const renderQuiz = () => {
        const question = placementQuestions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / placementQuestions.length) * 100;

        return (
            <div className="w-full">
                <div className="mb-4">
                    <p className="text-sm font-semibold text-hanguk-blue-600 dark:text-hanguk-blue-400 text-center">Câu {currentQuestionIndex + 1} / {placementQuestions.length}</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                        <div className="bg-hanguk-blue-600 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <h2 className="text-xl font-bold my-6 text-center">{question.question}</h2>
                <div className="space-y-3">
                    {question.options.map(option => (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            className="w-full p-4 text-left border-2 rounded-lg font-semibold transition-colors bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderResult = () => {
        const levelMap: Record<LearningLevel, string> = {
            beginner: 'Sơ cấp',
            intermediate: 'Trung cấp',
            advanced: 'Cao cấp',
        };

        const messageMap: Record<LearningLevel, string> = {
            beginner: 'Bạn là người mới bắt đầu! Lộ trình học sẽ tập trung vào các kiến thức nền tảng vững chắc.',
            intermediate: 'Bạn đã có kiến thức cơ bản! Lộ trình học sẽ giúp bạn mở rộng ngữ pháp và từ vựng trung cấp.',
            advanced: 'Bạn đã ở trình độ khá! Lộ trình học sẽ thử thách bạn với các chủ đề và cấu trúc nâng cao.',
        };
        
        return (
            <div className="text-center">
                 <div className="mx-auto mb-6 p-4 bg-green-100 dark:bg-green-900 rounded-full inline-block">
                    <BrainCircuitIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Hoàn thành!</h1>
                 <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                    Bạn đã trả lời đúng <strong className="text-hanguk-blue-600 dark:text-hanguk-blue-400">{score}/{placementQuestions.length}</strong> câu.
                </p>
                <p className="mt-2 text-xl text-slate-800 dark:text-white">
                    Trình độ của bạn được xác định là: <strong className="text-2xl text-hanguk-blue-600 dark:text-hanguk-blue-400">{levelMap[determinedLevel]}</strong>
                </p>
                <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    {messageMap[determinedLevel]}
                </p>
                <button
                    onClick={() => onComplete(determinedLevel)}
                    className="mt-8 w-full sm:w-auto px-8 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 transition-colors"
                >
                    Bắt đầu học
                </button>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg p-8 animate-fade-in-up">
                {step === 'intro' && renderIntro()}
                {step === 'quiz' && renderQuiz()}
                {step === 'result' && renderResult()}
            </div>
        </div>
    );
};

export default PlacementTest;