import React, { useEffect, useMemo } from 'react';
import Confetti from './Confetti';

interface CelebrationAnimationProps {
  type: 'goal' | 'badge';
  title: string;
  description: string;
  badgeIcon?: React.FC<any>;
  onClose: () => void;
}

const goalGifs = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3dta3FsdGVmYjd1ZWVmaXRycXl4ZGJ4OWZ6ZndjMmNzbTVyNzdhdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2gtoSIzdrSMFO/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDJvYnBqbWc5cTl0ZmJ2YW5qNHlpcjQzaXh4dmN0NTNscG1rOWZ1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oz8xAFtqoOUUrsh7W/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWZ0ZmE5ZXU4Nm4zNnpkNnpudTZ6OTM4MGtrbnE2cm1rZ2s4cDIxOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/blSTtTqu9clvG/giphy.gif',
];

const badgeGifs = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDJ3eGNpaHB6dDBqOG43eWMyNjdsaXNydzV0bzh5Znh1a3c0ZmpkYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o72FcJmLzIdYJdmDe/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExejB1emJkNzR4cWN5bnFhYjFhdzEwYTB0dG94bTh0eXl0OTJ0a3J4NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6fJ1BM7R2EBRDnxK/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExanE0c3V3ZGNic3h4bW1iZGx1bmV2d216MnpuaWh3MDFhMzlhaHJxaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MVi14t2aJ0m2Y/giphy.gif',
];


const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({ type, title, description, badgeIcon: BadgeIcon, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000); // Auto-close after 6 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const gifUrl = useMemo(() => {
    const gifs = type === 'badge' ? badgeGifs : goalGifs;
    return gifs[Math.floor(Math.random() * gifs.length)];
  }, [type]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex justify-center items-center p-4 animate-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
    >
      <Confetti />
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-md m-4 text-center overflow-hidden animate-modal-content" onClick={e => e.stopPropagation()}>
        <img src={gifUrl} alt="Celebration" className="w-full h-48 object-cover" />
        <div className="p-6">
          {BadgeIcon && (
            <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-yellow-400 -mt-16 border-4 border-white dark:border-slate-800 relative z-10">
                <BadgeIcon className="w-12 h-12 text-white" />
            </div>
          )}
          <h2 id="celebration-title" className={`text-3xl font-bold text-slate-800 dark:text-white ${BadgeIcon ? '' : '-mt-8'}`}>
            {title}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{description}</p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-hanguk-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-hanguk-blue-700 transition-colors"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CelebrationAnimation);
