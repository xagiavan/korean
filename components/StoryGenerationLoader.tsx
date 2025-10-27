
import React, { useState, useEffect } from 'react';

const messages = [
    'Gia sư AI đang sáng tác một câu chuyện độc đáo...',
    'Sắp xếp các từ ngữ tiếng Hàn và Việt...',
    'Thêm một chút gia vị kỳ diệu...',
    'Kiểm tra lại cốt truyện...',
    'Câu chuyện của bạn sắp ra lò rồi!',
];

const StoryGenerationLoader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 3000); // Change message every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-full w-full p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="w-12 h-12 border-4 border-hanguk-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p key={messageIndex} className="mt-6 text-lg font-semibold text-slate-600 dark:text-slate-300 transition-opacity duration-500 animate-fade-in">
                {messages[messageIndex]}
            </p>
        </div>
    );
};

export default StoryGenerationLoader;
