import React, { useEffect, memo } from 'react';

const Confetti: React.FC = () => {
  useEffect(() => {
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;

    // Clear any previous confetti
    confettiContainer.innerHTML = '';

    const colors = ['#4280f5', '#3368e7', '#facc15', '#4ade80', '#fb923c', '#f472b6'];
    const confettiCount = 120;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      const width = 5 + Math.random() * 10;
      const height = 10 + Math.random() * 10;
      confetti.style.width = `${width}px`;
      confetti.style.height = `${height}px`;
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `${-20 + Math.random() * -80}px`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.animationDelay = `${Math.random() * 2.5}s`;
      confetti.style.animationDuration = `${3 + Math.random() * 4}s`;
      confettiContainer.appendChild(confetti);
    }
    
    const timeoutId = setTimeout(() => {
        if(confettiContainer) {
            confettiContainer.innerHTML = '';
        }
    }, 7000);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
};

export default memo(Confetti);
