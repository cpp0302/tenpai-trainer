"use client";

import { useEffect, useState } from "react";

interface OrientationGuardProps {
  children: React.ReactNode;
}

export default function OrientationGuard({ children }: OrientationGuardProps) {
  const [isLandscape, setIsLandscape] = useState(true);

  useEffect(() => {
    const checkOrientation = () => {
      // スマートフォンでのみチェック（画面幅768px未満）
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setIsLandscape(window.innerWidth > window.innerHeight);
      } else {
        setIsLandscape(true); // PCは常にOK
      }
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isLandscape) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold mb-4">画面を横向きにしてください</h2>
          <p className="text-gray-300">
            このアプリは横画面（ランドスケープ）での利用を推奨しています。
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
