'use client';

import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    console.log('Calculator initializing height sender');

    function sendHeight() {
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
      );
      
      // Send to parent with any origin for now (we'll secure this later)
      console.log('Sending height:', height);
      window.parent.postMessage({
        type: 'calculator-resize',  // Specific type to identify our messages
        height: height
      }, '*');
    }

    // Send height on load
    sendHeight();

    // Send height when content changes
    const observer = new ResizeObserver(() => {
      console.log('Content size changed');
      sendHeight();
    });

    observer.observe(document.body);

    // Send height again after a brief delay to catch any dynamic content
    setTimeout(sendHeight, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <html>
      <body>{children}<SpeedInsights /></body>
    </html>
  );
}