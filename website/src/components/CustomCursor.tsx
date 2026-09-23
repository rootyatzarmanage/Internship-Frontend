import React, { useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const CustomCursor: React.FC = () => {
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const followerRef = React.useRef<HTMLDivElement>(null);

  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [cursorText, setCursorText] = useState<string>('');

  // Mouse movement & event listeners
  useGSAP(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // Fast setters for smoother performance during mousemove
    const xCursorTo = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power2.out' });
    const yCursorTo = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power2.out' });
    const xFollowerTo = gsap.quickTo(follower, 'x', { duration: 0.3, ease: 'power2.out' });
    const yFollowerTo = gsap.quickTo(follower, 'y', { duration: 0.3, ease: 'power2.out' });

    const moveCursor = (e: MouseEvent) => {
      xCursorTo(e.clientX);
      yCursorTo(e.clientY);
      xFollowerTo(e.clientX);
      yFollowerTo(e.clientY);
    };

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorType = target.dataset.cursor;
      if (cursorType === 'hover') {
        setIsHovering(true);
      } else if (cursorType === 'text') {
        setIsHovering(true);
        setCursorText(target.dataset.cursorText || 'View');
      }
    };

    const handleHoverEnd = () => {
      setIsHovering(false);
      setCursorText('');
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleHoverStart);
    document.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseout', handleHoverEnd);
    };
  }, []);

  // Hover state animations
  useGSAP(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    if (isHovering) {
      gsap.to(cursor, { scale: 0.5, duration: 0.3 });
      gsap.to(follower, {
        scale: 3,
        opacity: 0.5,
        backgroundColor: 'white',
        mixBlendMode: 'difference',
        duration: 0.3,
      });
    } else {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(follower, {
        scale: 1,
        opacity: 1,
        backgroundColor: 'transparent',
        border: '1px solid white',
        mixBlendMode: 'normal',
        duration: 0.3,
      });
    }
  }, [isHovering]);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998] border border-white -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-colors duration-300 ${
          isHovering ? 'mix-blend-difference' : ''
        }`}
      >
        {cursorText && (
          <span className="text-[4px] font-bold text-black uppercase tracking-widest">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
};

export default CustomCursor;