import React, { useEffect, useRef, useState } from 'react';

// Extend the Window interface to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

interface AdBannerProps {
  className?: string;
  style?: React.CSSProperties;
  slot: string;
  format?: string;
  responsive?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  className = '', 
  style = {}, 
  slot, 
  format = 'auto', 
  responsive = 'true' 
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [hasPushed, setHasPushed] = useState(false);

  useEffect(() => {
    if (hasPushed || !adRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the ad container is intersecting the viewport and we haven't pushed yet
        if (entry.isIntersecting && !hasPushed) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setHasPushed(true); // Mark as pushed to prevent re-pushing
          } catch (err) {
            console.error("AdSense error:", err);
          }
          // Disconnect the observer after the ad is pushed to avoid unnecessary work
          observer.disconnect();
        }
      },
      {
        // Trigger the observer when the element is visible at all
        threshold: 0,
      }
    );

    observer.observe(adRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasPushed]);

  // IMPORTANT: The user must replace this with their own client ID.
  const adClient = "ca-pub-XXXXXXXXXXXXXXXX";

  return (
    <div ref={adRef} className={`flex flex-col justify-center items-center ${className}`} style={style}>
      <ins
        className="adsbygoogle w-full h-full"
        style={{ display: 'block', backgroundColor: '#2d3748', border: '1px dashed #4a5568', color: '#a0aec0', textAlign: 'center' }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
        aria-label="Advertisement"
      ></ins>
       <span className="text-xs text-gray-500 block text-center mt-1">Advertisement</span>
    </div>
  );
};

export default AdBanner;
