'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if splash has already been shown this session
    const splashShown = sessionStorage.getItem('splashShown');
    
    if (splashShown) {
      setIsVisible(false);
      return;
    }

    // Mark splash as shown for this session
    sessionStorage.setItem('splashShown', 'true');
    setHasShown(true);

    // Hide splash after animation
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || !hasShown) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#092f87] animate-fadeOut">
      <div className="animate-splash">
        <Image
          src="/splash_logo.png"
          alt="ELC Logo"
          width={300}
          height={300}
          priority
          className="w-64 h-64 md:w-80 md:h-80"
        />
      </div>
    </div>
  );
}