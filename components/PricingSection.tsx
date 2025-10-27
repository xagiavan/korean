import React from 'react';

interface PricingSectionProps {
    onSelectPlan: () => void;
}

const plans = [
  {
    name: 'Gói Tháng',
    price: '49.000',
    period: '/ tháng',
    description: 'Linh hoạt, phù hợp để dùng thử tất cả các tính năng VIP.',
    badge: null,
  },
  {
    name: 'Gói Năm',
    price: '499.000',
    period: '/ năm',
    description: 'Lựa chọn tốt nhất cho việc học tập lâu dài và tiết kiệm.',
    badge: 'Tiết kiệm 17%',
    popular: true,
  },
  {
    name: 'Gói Trọn đời',
    price: '999.000',
    period: 'vĩnh viễn',
    description: 'Trả phí một lần duy nhất để sở hữu toàn bộ tính năng mãi mãi.',
    badge: 'Mua 1 lần',
  },
];

const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg flex flex-col relative transition-all-base hover:scale-105 hover:shadow-xl ${plan.popular ? 'border-2 border-hanguk-blue-500' : 'border border-transparent'}`}
          >
            {plan.popular && (
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-hanguk-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                PHỔ BIẾN NHẤT
              </div>
            )}
            <h3 className="text-2xl font-bold text-center text-slate-800 dark:text-white">{plan.name}</h3>
            {plan.badge && (
                <p className="text-center text-sm font-semibold bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200 rounded-full px-3 py-1 mt-2 mx-auto">
                    {plan.badge}
                </p>
            )}
            <div className="my-6 text-center">
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
              <span className="text-slate-500 dark:text-slate-400"> VNĐ</span>
              <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>
            </div>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8 flex-grow">{plan.description}</p>
            <button
              onClick={onSelectPlan}
              className={`w-full py-3 font-bold rounded-lg shadow-md transition-all-base ${plan.popular ? 'bg-hanguk-blue-600 text-white hover:bg-hanguk-blue-700' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
            >
              Chọn gói
            </button>
          </div>
        ))}
      </div>
    );
};

export default PricingSection;