

/**
 * Uses the browser's SpeechSynthesis API to speak a given text.
 * @param text The text to be spoken.
 * @param lang The language code (e.g., 'ko-KR', 'vi-VN', 'en-US'). Defaults to Korean.
 * @param onEndCallback An optional callback function to execute when speech synthesis is finished.
 */
export const speak = (text: string, lang: string = 'ko-KR', onEndCallback?: () => void) => {
    if (!('speechSynthesis' in window)) {
        alert("Rất tiếc, trình duyệt của bạn không hỗ trợ tính năng phát âm.");
        onEndCallback?.();
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for clarity
    
    // Find a suitable voice
    // getVoices can be async, so we might need to listen for the voiceschanged event
    const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const desiredVoice = voices.find(voice => voice.lang === lang);
        if (desiredVoice) {
            utterance.voice = desiredVoice;
        }
    };

    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoice;
    } else {
        setVoice();
    }
    
    if (onEndCallback) {
        utterance.onend = onEndCallback;
    }

    window.speechSynthesis.speak(utterance);
};