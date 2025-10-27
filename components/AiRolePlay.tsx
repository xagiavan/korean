import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, Content, FunctionDeclaration } from "@google/genai";
import * as geminiService from '../services/geminiService';
import type { Scenario, ChatMessage, PerformanceReport, ScenarioTask, AppFeatureProps, Badge } from '../types';
import FeatureHeader from './FeatureHeader';
import Loader from './Loader';
import { useAuth } from '../contexts/AuthContext';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';
import { UserIcon, SendIcon, CheckCircleIcon, XCircleIcon, LightbulbIcon, AcademicCapIcon, UpgradeIcon } from './icons/Icons';
import CircularProgress from './CircularProgress';
import * as gamificationService from '../services/gamificationService';
import * as featureFlagService from '../services/featureFlagService';
import * as usageService from '../services/usageService';
import { useToast } from '../contexts/ToastContext';

type RolePlayState = 'scenario_selection' | 'in_progress' | 'mission_complete' | 'analyzing' | 'report';

const AiRolePlay: React.FC<AppFeatureProps> = ({ setActiveFeature, payload }) => {
    const { currentUser } = useAuth();
    const { addToast, showBadgeCelebration } = useToast();
    const [state, setState] = useState<RolePlayState>('scenario_selection');
    const [scenarios] = useState<Scenario[]>(geminiService.scenarios);
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);
    const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);
    const [isUsageLimited, setIsUsageLimited] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    const startScenario = useCallback(async (scenario: Scenario) => {
        if (!currentUser?.isVip) {
            if (featureFlagService.isFeatureEnabled('rolePlayLimit')) {
                usageService.resetRolePlayUsage();
                setIsUsageLimited(false);
            } else {
                 addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Nhập vai AI là tính năng dành cho tài khoản VIP.' });
                 return;
            }
        }
        
        setSelectedScenario(scenario);
        setState('in_progress');
        setIsLoading(true);
        setMessages([]);
        setCompletedTasks([]);
        
        const { greeting, characterDescription } = await geminiService.startAiRolePlay(scenario.title, scenario.character);
        const systemMessage: ChatMessage = { role: 'system', parts: [{ text: `Bạn đang nhập vai ${characterDescription}` }] };
        const aiGreeting: ChatMessage = { role: 'model', parts: [{ text: greeting }] };
        setMessages([systemMessage, aiGreeting]);
        setIsLoading(false);
    }, [currentUser, addToast]);
    
    useEffect(() => {
        if (payload?.word) {
            const word = payload.word;
            // Attempt to find a scenario that includes the word in its title, description, or mission objective.
            const relatedScenario = scenarios.find(s => 
                s.title.includes(word) || 
                s.description.includes(word) ||
                s.mission.objective.includes(word)
            );
            if (relatedScenario) {
                startScenario(relatedScenario);
            } else {
                 addToast({ type: 'info', title: 'Không tìm thấy', message: `Không có kịch bản nhập vai cụ thể cho từ "${word}". Vui lòng chọn một kịch bản.`});
            }
        }
    }, [payload, scenarios, startScenario, addToast]);


    const handleSendMessage = async () => {
        if (!userInput.trim() || !selectedScenario || !currentUser?.email) return;
        
        if (!currentUser?.isVip && featureFlagService.isFeatureEnabled('rolePlayLimit') && usageService.isRolePlayLimitReached()) {
            setIsUsageLimited(true);
            return;
        }

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: userInput }] };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        
        if (!currentUser?.isVip && featureFlagService.isFeatureEnabled('rolePlayLimit')) {
            usageService.incrementRolePlayUsage();
        }

        setIsLoading(true);

        const history: Content[] = messages
          .filter(m => m.role === 'user' || m.role === 'model')
          .map(m => ({
              role: m.role,
              parts: m.parts,
          }));
        history.push({ role: 'user', parts: userMessage.parts });
        
        const tools = [{ functionDeclarations: selectedScenario.mission.functionDeclarations }];
        
        try {
            const response = await geminiService.generateRolePlayResponse(history, selectedScenario.character, tools);

            let newCompletedTasks = [...completedTasks];

            if (response.functionCalls && response.functionCalls.length > 0) {
                response.functionCalls.forEach(fc => {
                    if (!newCompletedTasks.includes(fc.name)) {
                        newCompletedTasks.push(fc.name);
                    }
                });
                
                // For now, just send a generic tool response back to AI
                const toolResponseHistory = [...history, {role: 'model', parts: [{functionCall: response.functionCalls[0]}]}];
                toolResponseHistory.push({
                    role: 'user', 
                    parts: [{
                        functionResponse: { 
                            name: response.functionCalls[0].name, 
                            response: { name: response.functionCalls[0].name, content: { result: "User performed the action successfully." } }
                        }
                    }]
                });

                const finalResponse = await geminiService.generateRolePlayResponse(toolResponseHistory, selectedScenario.character, []);
                setMessages(prev => [...prev, { role: 'model', parts: [{ text: finalResponse.text }] }]);

            } else {
                 setMessages(prev => [...prev, { role: 'model', parts: [{ text: response.text }] }]);
            }

            setCompletedTasks(newCompletedTasks);

            const allTasksDone = selectedScenario.mission.tasks.every(task => newCompletedTasks.includes(task.id));
            if(allTasksDone) {
                setState('mission_complete');
                const { newBadges: xpBadges } = await gamificationService.addXp(200);
                const completionBadges = await gamificationService.recordRolePlayCompletion(selectedScenario.id);
                showBadgeCelebration([...xpBadges, ...completionBadges]);
            }

        } catch (error) {
            console.error("Error generating AI response:", error);
            const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại." }] };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const analyzePerformance = async () => {
        setState('analyzing');
        const report = await geminiService.analyzeConversationPerformance(messages);
        setPerformanceReport(report);
        setState('report');
    };
    
    const reset = () => {
        setState('scenario_selection');
        setSelectedScenario(null);
        setMessages([]);
        setCompletedTasks([]);
        setPerformanceReport(null);
    };

    if (state === 'scenario_selection') {
        return (
            <div className="max-w-4xl mx-auto">
                <FeatureHeader title="Nhập vai AI" description="Thực hành các tình huống giao tiếp thực tế với đối tác AI." />
                {!currentUser?.isVip && <UpgradeToVipPrompt featureName="nhập vai AI" setActiveFeature={setActiveFeature as any} />}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scenarios.map(sc => (
                        <div key={sc.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex flex-col">
                            <h3 className="font-bold text-lg text-hanguk-blue-800 dark:text-hanguk-blue-300">{sc.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex-grow">{sc.description}</p>
                            <button onClick={() => startScenario(sc)} className="mt-4 w-full px-4 py-2 bg-hanguk-blue-600 text-white font-semibold rounded-lg disabled:bg-slate-400">
                                Bắt đầu
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    if (state === 'report') {
        return (
             <div className="max-w-2xl mx-auto text-center">
                <FeatureHeader title="Báo cáo hiệu suất" description="Gia sư AI đã phân tích cuộc hội thoại của bạn." />
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md animate-fade-in-up">
                    <CircularProgress score={performanceReport?.overallScore || 0} />
                    <div className="text-left mt-6 space-y-4">
                        <div>
                            <h4 className="font-bold text-green-600">Điểm mạnh</h4>
                            <p>{performanceReport?.positiveFeedback}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-yellow-600">Góp ý</h4>
                            <p>{performanceReport?.improvementSuggestion}</p>
                        </div>
                         <div>
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-blue-600">Trọng tâm ngữ pháp: {performanceReport?.grammarFocus.point}</h4>
                                {performanceReport?.grammarFocus.point && (
                                    <button
                                        onClick={() => setActiveFeature('grammarCurriculum', { searchTerm: performanceReport.grammarFocus.point })}
                                        className="flex items-center gap-1 text-xs font-bold text-hanguk-blue-600 dark:text-hanguk-blue-400 hover:underline"
                                    >
                                        <AcademicCapIcon small />
                                        Học thêm
                                    </button>
                                )}
                            </div>
                            <p>{performanceReport?.grammarFocus.explanation}</p>
                        </div>
                    </div>
                </div>
                <button onClick={reset} className="mt-6 px-6 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md">Chọn kịch bản khác</button>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col max-w-4xl mx-auto">
            <FeatureHeader title={selectedScenario?.title || ''} description={`Bạn đang nói chuyện với ${selectedScenario?.character || ''}`} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
                
                {/* Mission panel - Appears first on mobile */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 lg:order-last">
                     <h3 className="font-bold text-lg border-b pb-2 mb-2">Nhiệm vụ</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{selectedScenario?.mission.objective}</p>
                     <ul className="space-y-2">
                        {selectedScenario?.mission.tasks.map(task => (
                            <li key={task.id} className="flex items-center gap-2 text-sm">
                                {completedTasks.includes(task.id) ? <CheckCircleIcon className="text-green-500" /> : <XCircleIcon className="text-slate-400" />}
                                <span className={completedTasks.includes(task.id) ? 'line-through text-slate-500' : ''}>{task.description}</span>
                            </li>
                        ))}
                     </ul>
                </div>
                
                {/* Chat window */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-md flex flex-col h-[70vh] lg:h-full">
                    <div className="flex-grow p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => msg.role !== 'system' && (
                             <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-hanguk-blue-100 dark:bg-hanguk-blue-900 flex items-center justify-center font-bold text-sm flex-shrink-0">AI</div>}
                                <div className={`max-w-xs sm:max-w-md p-3 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-hanguk-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                    {msg.parts[0].text}
                                </div>
                                {msg.role === 'user' && <UserIcon className="w-8 h-8 p-1 rounded-full bg-slate-200 dark:bg-slate-600 flex-shrink-0" />}
                            </div>
                        ))}
                        {isLoading && <div className="flex justify-center"><Loader /></div>}
                        <div ref={messagesEndRef} />
                    </div>
                    {state === 'mission_complete' ? (
                         <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center bg-green-100 dark:bg-green-900/50">
                            <p className="font-bold text-green-700 dark:text-green-300">🎉 Chúc mừng, bạn đã hoàn thành nhiệm vụ! 🎉</p>
                            <button onClick={analyzePerformance} className="mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg">Xem báo cáo</button>
                        </div>
                    ) : isUsageLimited ? (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center bg-yellow-50 dark:bg-yellow-900/30">
                            <div className="flex flex-col items-center p-4">
                                <div className="p-3 bg-yellow-400/30 rounded-full mb-3">
                                    <UpgradeIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <h4 className="font-bold text-lg text-slate-800 dark:text-white">Bạn đã đạt giới hạn 10 tin nhắn!</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-sm">
                                    Nâng cấp tài khoản VIP để trò chuyện không giới hạn, nhận báo cáo hiệu suất chi tiết và khám phá tất cả các kịch bản học tập.
                                </p>
                                <button
                                    onClick={() => setActiveFeature('upgrade' as any)}
                                    className="mt-4 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity"
                                >
                                    Nâng cấp lên VIP ngay
                                </button>
                            </div>
                        </div>
                    ) : (
                         <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                                <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Nhập câu trả lời..." className="flex-grow p-2 bg-slate-100 dark:bg-slate-700 rounded-lg" disabled={isLoading} />
                                <button type="submit" disabled={isLoading || !userInput} className="p-2 bg-hanguk-blue-600 text-white rounded-lg disabled:bg-slate-400"><SendIcon/></button>
                            </form>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AiRolePlay;