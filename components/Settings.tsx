import React from 'react';
import FeatureHeader from './FeatureHeader';
import { useAdmin } from '../contexts/AdminContext';
import type { AppFeatureProps, AppSettings } from '../types';

const Settings: React.FC<AppFeatureProps> = ({ settings, setSettings }) => {
    const { isAdminVip, toggleAdminVipStatus } = useAdmin();

    return (
        <div className="max-w-4xl mx-auto">
            <FeatureHeader
                title="Cài đặt"
                description="Quản lý giao diện và hành vi của ứng dụng."
            />

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
                 <h3 className="text-lg font-bold mb-3">Giao diện & Bố cục</h3>
                 <div className="space-y-4">
                    {/* Theme Settings */}
                    <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-200 text-sm mb-2">Giao diện</label>
                        <div className="flex gap-1 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                            {(['light', 'dark', 'system'] as const).map(theme => (
                                <button key={theme} onClick={() => setSettings?.(s => ({...s!, theme}))} className={`flex-1 px-4 py-1.5 rounded-md font-semibold text-sm transition-colors ${settings?.theme === theme ? 'bg-white dark:bg-slate-800 text-hanguk-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>
                                    {theme === 'light' ? 'Sáng' : theme === 'dark' ? 'Tối' : 'Hệ thống'}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Sidebar Settings */}
                     <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-200 text-sm mb-2">Hành vi Sidebar (Desktop)</label>
                        <div className="flex gap-1 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                             {(['pinned', 'collapsible'] as const).map(mode => (
                                <button key={mode} onClick={() => setSettings?.(s => ({...s!, sidebarMode: mode}))} className={`flex-1 px-4 py-1.5 rounded-md font-semibold text-sm transition-colors ${settings?.sidebarMode === mode ? 'bg-white dark:bg-slate-800 text-hanguk-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>
                                    {mode === 'pinned' ? 'Ghim cố định' : 'Có thể thu gọn'}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Font Size Settings */}
                    <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-200 text-sm mb-2">Cỡ chữ</label>
                        <div className="flex gap-1 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                            {(['sm', 'base', 'lg'] as const).map(size => (
                                <button key={size} onClick={() => setSettings?.(s => ({...s!, fontSize: size}))} className={`flex-1 px-4 py-1.5 rounded-md font-semibold text-sm transition-colors ${settings?.fontSize === size ? 'bg-white dark:bg-slate-800 text-hanguk-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>
                                    {size === 'sm' ? 'Nhỏ' : size === 'base' ? 'Mặc định' : 'Lớn'}
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
                 <h3 className="text-lg font-bold mb-3">Bảng điều khiển Admin (Mô phỏng)</h3>
                 <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                    <div>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">Kích hoạt Chế độ VIP</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Ghi đè trạng thái VIP của tài khoản hiện tại cho mục đích thử nghiệm.</p>
                    </div>
                     <label htmlFor="vip-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="vip-toggle" className="sr-only peer" checked={isAdminVip} onChange={toggleAdminVipStatus} />
                        <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-hanguk-blue-300 dark:peer-focus:ring-hanguk-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-hanguk-blue-600"></div>
                    </label>
                 </div>
            </div>
        </div>
    );
};

export default Settings;
