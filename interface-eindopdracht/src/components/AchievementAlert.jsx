import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const AchievementAlert = ({ achievement, onClear }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    if (achievement) {
      const toast = toastRef.current;
      
      // Animate entry: slide up and fade in
      gsap.killTweensOf(toast);
      
      const tl = gsap.timeline({
        onComplete: () => {
          // Delay, then slide down and trigger clear
          gsap.to(toast, {
            y: 150,
            opacity: 0,
            duration: 0.5,
            delay: 3,
            ease: 'power2.in',
            onComplete: onClear
          });
        }
      });

      tl.fromTo(toast,
        { y: 150, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' }
      );
    }
  }, [achievement, onClear]);

  if (!achievement) return null;

  return (
    <div ref={toastRef} className="achievement-toast">
      <div className="toast-icon">🏆</div>
      <div className="toast-text">
        <div className="toast-title">ACHIEVEMENT UNLOCKED!</div>
        <div className="toast-message">{achievement}</div>
      </div>
    </div>
  );
};

export default AchievementAlert;
