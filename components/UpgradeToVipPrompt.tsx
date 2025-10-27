import React from 'react';
import { useAuth } from '../contexts/AuthContext';

type Feature = 'dictionary' | 'translator' | 'vocab' | 'srs' | 'conversations' | 'pronunciation' | 'handwriting' | 'quiz' | 'settings' | 'upgrade' | 'auth';

interface UpgradeToVipPromptProps {
  featureName: string;
  setActiveFeature: (feature: Feature) => void;
  isSampleData?: boolean;
}

const UpgradeToVipPrompt: React.FC<UpgradeToVipPromptProps> = ({ featureName, setActiveFeature, isSampleData = false }) => {
  const { currentUser } = useAuth();
  
  const promptMessage = currentUser
    ? (
        <>
            Để mở khóa {featureName}, vui lòng
            <button
            onClick={() => setActiveFeature('upgrade')}
            className="font-bold underline hover:text-hanguk-blue-800 dark:hover:text-hanguk-blue-200 ml-1"
            >
            nâng cấp tài khoản
            </button>.
        </>
    )
    : (
        <>
            Để mở khóa {featureName}, trước tiên bạn cần
            <button
            onClick={() => setActiveFeature('auth')}
            className="font-bold underline hover:text-hanguk-blue-800 dark:hover:text-hanguk-blue-200 mx-1"
            >
            đăng nhập hoặc đăng ký
            </button>
             tài khoản.
        </>
    );

  return (
    <div className="mb-4 p-4 bg-hanguk-blue-100 dark:bg-hanguk-blue-900/50 border-l-4 border-hanguk-blue-500 text-hanguk-blue-700 dark:text-hanguk-blue-300 rounded-r-lg">
      <p className="font-bold">Tính năng VIP</p>
      <p className="text-sm">
        {isSampleData && "Dữ liệu bạn thấy bên dưới là dữ liệu mẫu. "}
        {promptMessage}
      </p>
    </div>
  );
};

export default UpgradeToVipPrompt;
