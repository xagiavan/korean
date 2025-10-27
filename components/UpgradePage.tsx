import React from 'react';
import FeatureHeader from './FeatureHeader';
import { CheckIcon, XIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import PricingSection from './PricingSection';
import { useToast } from '../contexts/ToastContext';

type Feature = 'settings' | 'auth';

interface UpgradePageProps {
  setActiveFeature: (feature: Feature) => void;
}

const features = [
  { name: 'Dịch thuật & Tra cứu từ điển', free: '5 lượt / ngày', vip: 'Không giới hạn' },
  { name: 'Từ vựng TOPIK, Hội thoại, Quiz', free: 'Sử dụng dữ liệu mẫu', vip: 'Tạo mới & không giới hạn' },
  { name: 'Ôn tập lặp lại ngắt quãng (SRS)', free: 'Lưu tối đa 50 từ', vip: 'Không giới hạn' },
  { name: 'Nhập vai & Gia sư AI Live', free: 'Giới hạn lượt dùng', vip: 'Không giới hạn' },
  { name: 'Tạo thẻ học nhanh & Phân tích ngữ pháp', free: false, vip: true },
  { name: 'Đồng bộ hóa đám mây', free: false, vip: 'Sắp ra mắt' },
  { name: 'Trải nghiệm', free: 'Có thể có quảng cáo', vip: 'Không quảng cáo' },
];

const UpgradePage: React.FC<UpgradePageProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();

    const handleSelectPlan = () => {
        if (currentUser) {
            addToast({
                type: 'info',
                title: 'Sắp ra mắt',
                message: 'Tính năng thanh toán sẽ sớm được tích hợp. Admin có thể kích hoạt VIP trong Cài đặt.'
            });
            setActiveFeature('settings');
        } else {
            addToast({
                type: 'info',
                title: 'Yêu cầu đăng nhập',
                message: 'Vui lòng đăng nhập hoặc đăng ký để nâng cấp tài khoản.'
            });
            setActiveFeature('auth');
        }
    }

  return (
    <div className="max-w-5xl mx-auto">
      <FeatureHeader
        title="Mở khóa toàn bộ tiềm năng học tập"
        description="Chọn gói VIP để truy cập không giới hạn tất cả các tính năng cao cấp, giúp bạn chinh phục Tiếng Hàn nhanh hơn."
      />

      {/* Comparison Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-center mb-6">So sánh các gói</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="border-b dark:border-slate-700">
                <th className="py-3 px-4 text-left font-semibold text-slate-700 dark:text-slate-200">Tính năng</th>
                <th className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Miễn phí</th>
                <th className="py-3 px-4 font-semibold text-hanguk-blue-600 dark:text-hanguk-blue-400">VIP</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={feature.name} className={`border-b dark:border-slate-700 last:border-b-0 ${index % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900/50' : ''}`}>
                  <td className="py-4 px-4 text-left">{feature.name}</td>
                  <td className="py-4 px-4">
                    {typeof feature.free === 'boolean' ? (
                      feature.free ? <CheckIcon className="mx-auto" /> : <XIcon className="mx-auto" />
                    ) : (
                      <span className="text-slate-600 dark:text-slate-300">{feature.free}</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {typeof feature.vip === 'boolean' ? (
                      feature.vip ? <CheckIcon className="mx-auto text-green-500"/> : <XIcon className="mx-auto" />
                    ) : (
                      <span className="font-semibold text-hanguk-blue-600 dark:text-hanguk-blue-400">{feature.vip}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <PricingSection onSelectPlan={handleSelectPlan} />

    </div>
  );
};

export default UpgradePage;