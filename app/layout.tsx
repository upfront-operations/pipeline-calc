'use client';

import { useEffect } from 'react';

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    function sendHeight() {
      try {
        // Make sure we're in an iframe
        if (window.parent && window.parent !== window) {
          const height = Math.max(
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight,
            document.documentElement.clientHeight
          );
          
          window.parent.postMessage({
            type: 'resize',
            height: height
          }, '*');  // We'll let the parent handle origin verification
        }
      } catch (error) {
        console.error('Error sending height:', error);
      }
    }

    // Create observer with error handling
    try {
      const observer = new ResizeObserver(() => {
        // Clear any pending timeout
        if (timeoutId) clearTimeout(timeoutId);
        // Debounce the height updates
        timeoutId = setTimeout(sendHeight, 50);
      });

      // Start observing with error handling
      if (document.body) {
        observer.observe(document.body);
        
        // Initial height after short delay to ensure content is rendered
        setTimeout(sendHeight, 100);
        
        // Additional check for dynamic content
        setTimeout(sendHeight, 1000);
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        observer.disconnect();
      };
    } catch (error) {
      console.error('Error setting up resize observer:', error);
      // Fallback to periodic checks if ResizeObserver fails
      const interval = setInterval(sendHeight, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}'use client';

import { useEffect } from 'react';

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    function sendHeight() {
      try {
        // Make sure we're in an iframe
        if (window.parent && window.parent !== window) {
          const height = Math.max(
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight,
            document.documentElement.clientHeight
          );
          
          window.parent.postMessage({
            type: 'resize',
            height: height
          }, '*');  // We'll let the parent handle origin verification
        }
      } catch (error) {
        console.error('Error sending height:', error);
      }
    }

    // Create observer with error handling
    try {
      const observer = new ResizeObserver(() => {
        // Clear any pending timeout
        if (timeoutId) clearTimeout(timeoutId);
        // Debounce the height updates
        timeoutId = setTimeout(sendHeight, 50);
      });

      // Start observing with error handling
      if (document.body) {
        observer.observe(document.body);
        
        // Initial height after short delay to ensure content is rendered
        setTimeout(sendHeight, 100);
        
        // Additional check for dynamic content
        setTimeout(sendHeight, 1000);
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        observer.disconnect();
      };
    } catch (error) {
      console.error('Error setting up resize observer:', error);
      // Fallback to periodic checks if ResizeObserver fails
      const interval = setInterval(sendHeight, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <html>
      <body>
        {children} 
        <SpeedInsights />
      </body>
    </html>
  );
}