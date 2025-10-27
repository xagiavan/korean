import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as authService from '../services/authService';
import * as gamificationService from '../services/gamificationService';
import * as srsService from '../services/srsService';
import * as historyService from '../services/historyService';
import * as translationHistoryService from '../services/translationHistoryService';
import * as errorTrackingService from '../services/errorTrackingService';
import * as statsService from '../services/statsService';
import * as playbackPositionService from '../services/playbackPositionService';

import type { User } from '../services/authService';
import type { GamificationState } from '../types';
import FeatureHeader from './FeatureHeader';
import Loader from './Loader';
import { useToast } from '../contexts/ToastContext';
import { UserIcon, UpgradeIcon, XCircleIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';

interface UserWithStats extends User {
    stats: GamificationState;
    srsDeckSize: number;
}

type FilterType = 'all' | 'vip' | 'free';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg flex items-center gap-4">
        <div className="p-3 bg-hanguk-blue-100 dark:bg-hanguk-blue-800 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
        </div>
    </div>
);


const AdminPanel: React.FC = () => {
    const { addToast } = useToast();
    const { currentUser } = useAuth();
    const [users, setUsers] = useState<UserWithStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');

    const loadUsersAndStats = useCallback(async () => {
        setIsLoading(true);
        const allUsers = await authService.getAllUsers();
        // NOTE: In a real app, you would have admin endpoints to fetch other users' data.
        // Here we can't get other users' data because our mock API is scoped to the current user.
        // We will mock this part for display purposes.
        const usersWithStats = await Promise.all(
            allUsers.map(async (user): Promise<UserWithStats> => {
                 // Mocking stats for other users as we can't fetch them.
                const stats = await gamificationService.getGamificationState();
                const srsDeckSize = await srsService.getDeckSize();
                return { 
                    ...user, 
                    stats: { ...stats, xp: Math.floor(Math.random() * 5000), level: Math.floor(Math.random()*10) + 1 }, 
                    srsDeckSize: Math.floor(Math.random() * 100) 
                };
            })
        );
        setUsers(usersWithStats.sort((a,b) => (b.isAdmin ? 1 : 0) - (a.isAdmin ? 1 : 0)));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadUsersAndStats();
    }, [loadUsersAndStats]);
    
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filter === 'all' || (filter === 'vip' && user.isVip) || (filter === 'free' && !user.isVip);
            return matchesSearch && matchesFilter;
        });
    }, [users, searchTerm, filter]);

    const handleToggleVip = async (email: string, currentStatus: boolean) => {
        setIsUpdating(email);
        const updatedUser = await authService.updateUser(email, { isVip: !currentStatus });
        if (updatedUser) {
            setUsers(prevUsers =>
                prevUsers.map(u => (u.email === email ? { ...u, isVip: updatedUser.isVip } : u))
            );
            addToast({
                type: 'success',
                title: 'Thành công',
                message: `Đã ${updatedUser.isVip ? 'cấp' : 'hủy'} VIP cho ${email}.`,
            });
        } else {
             addToast({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật người dùng.' });
        }
        setIsUpdating(null);
    };

    const handleResetData = async (email: string) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa TOÀN BỘ dữ liệu của người dùng ${email} không? Hành động này không thể hoàn tác.`)) {
            return;
        }
        setIsUpdating(email);
        try {
            // NOTE: In a real app, you'd call an admin endpoint with the target user's ID.
            // In this mock, we can't delete other users' data, so we'll just simulate it.
            console.log(`[ADMIN MOCK] Resetting all data for ${email}`);
            
            // FIX: Replaced non-existent authService.getCurrentUser() with currentUser from useAuth hook.
            // For the current user, we can actually delete it.
            if (currentUser?.email === email) {
                await gamificationService.deleteUserState();
                await srsService.deleteUserDeck();
                await historyService.deleteUserHistory();
                await translationHistoryService.deleteUserHistory();
                await errorTrackingService.deleteUserErrorStats();
                await statsService.deleteUserStats();
                await playbackPositionService.deleteUserPositions();
            }
            
            // Reload data to reflect changes (or remove from list in a real app)
            await loadUsersAndStats();
            addToast({
                type: 'success',
                title: 'Hoàn tất',
                message: `Đã xóa toàn bộ dữ liệu cho ${email}.`,
            });
        } catch (error) {
            console.error('Failed to reset user data:', error);
            addToast({ type: 'error', title: 'Lỗi', message: 'Không thể xóa dữ liệu người dùng.' });
        } finally {
            setIsUpdating(null);
        }
    };
    
    if (isLoading) {
        return <div className="min-h-[50vh] flex items-center justify-center"><Loader /></div>;
    }
    
    const totalUsers = users.length;
    const vipCount = users.filter(u => u.isVip).length;
    const vipPercentage = totalUsers > 0 ? ((vipCount / totalUsers) * 100).toFixed(1) : 0;

    return (
        <div className="max-w-6xl mx-auto">
            <FeatureHeader
                title="Bảng điều khiển Admin"
                description="Quản lý người dùng và theo dõi các chỉ số quan trọng của ứng dụng."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard title="Tổng người dùng" value={totalUsers} icon={<UserIcon className="w-6 h-6 text-hanguk-blue-600 dark:text-hanguk-blue-400"/>} />
                <StatCard title="Thành viên VIP" value={vipCount} icon={<UpgradeIcon className="w-6 h-6 text-yellow-500"/>} />
                <StatCard title="Tỷ lệ VIP" value={`${vipPercentage}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-grow">
                        <input 
                            type="text"
                            placeholder="Tìm kiếm theo email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"
                        />
                         {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')} 
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                aria-label="Clear search"
                            >
                                <XCircleIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="flex-shrink-0 flex gap-1 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                        {(['all', 'vip', 'free'] as FilterType[]).map(f => (
                             <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-md text-sm font-semibold ${filter === f ? 'bg-white dark:bg-slate-800 text-hanguk-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>
                                {f === 'all' ? 'Tất cả' : f === 'vip' ? 'VIP' : 'Miễn phí'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Người dùng</th>
                                <th scope="col" className="px-6 py-3">Trạng thái VIP</th>
                                <th scope="col" className="px-6 py-3">Cấp độ</th>
                                <th scope="col" className="px-6 py-3">SRS</th>
                                <th scope="col" className="px-6 py-3">Huy hiệu</th>
                                <th scope="col" className="px-6 py-3">Hoạt động cuối</th>
                                <th scope="col" className="px-6 py-3">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.email} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                                        {user.email}
                                        {user.isAdmin && <span className="ml-2 text-xs font-bold bg-cyan-200 text-cyan-800 px-2 py-0.5 rounded-full">Admin</span>}
                                    </th>
                                    <td className="px-6 py-4">
                                         <label htmlFor={`vip-toggle-${user.email}`} className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                id={`vip-toggle-${user.email}`}
                                                className="sr-only peer"
                                                checked={user.isVip}
                                                onChange={() => handleToggleVip(user.email, user.isVip)}
                                                disabled={isUpdating === user.email || user.isAdmin}
                                                title={user.isAdmin ? "Tài khoản Admin luôn là VIP" : "Bật/tắt trạng thái VIP"}
                                            />
                                            <div className="w-11 h-6 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 font-bold">{user.stats.level}</td>
                                    <td className="px-6 py-4">{user.srsDeckSize}</td>
                                    <td className="px-6 py-4">{user.stats.unlockedBadgeIds.length}</td>
                                    <td className="px-6 py-4">{user.stats.lastActivityDate === '1970-01-01' ? 'Chưa có' : user.stats.lastActivityDate}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleResetData(user.email)}
                                            disabled={isUpdating === user.email || user.isAdmin}
                                            title={user.isAdmin ? "Không thể reset dữ liệu của Admin" : `Xóa toàn bộ dữ liệu của ${user.email}`}
                                            className="font-medium text-red-600 dark:text-red-500 hover:underline disabled:opacity-50"
                                        >
                                            Reset Dữ liệu
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredUsers.length === 0 && <p className="text-center py-8 text-slate-500 dark:text-slate-400">Không tìm thấy người dùng nào khớp với bộ lọc.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
