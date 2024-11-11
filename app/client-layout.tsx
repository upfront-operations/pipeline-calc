// client-layout.tsx
'use client';

import { useEffect } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    function sendHeight() {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({
        type: 'calculator-resize',
        height: height
      }, '*');
    }

    // Send height when page loads
    sendHeight();
    
    // Send height again after a short delay
    setTimeout(sendHeight, 1000);

    // Watch for size changes
    const observer = new ResizeObserver(() => {
      sendHeight();
    });

    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}