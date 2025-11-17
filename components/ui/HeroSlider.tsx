import React, { useEffect, useState } from 'react';

interface Props {
  images: string[];
  heightClass?: string;
  intervalMs?: number;
  children?: React.ReactNode;
}

const HeroSlider: React.FC<Props> = ({ images, heightClass = 'h-screen', intervalMs = 3000, children }) => {
  const [current, setCurrent] = useState(0);
  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const t = setInterval(() => {
      setOverlay(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % images.length);
      }, 400);
      setTimeout(() => setOverlay(false), 800);
    }, intervalMs);
    return () => clearInterval(t);
  }, [images, intervalMs]);

  const bg = images && images.length ? images[current] : '';

  return (
    <div className={`relative ${heightClass} bg-cover bg-center text-white`} style={{ backgroundImage: `url('${bg}')` }}>
      <div className={`absolute inset-0 ${overlay ? 'opacity-60' : 'opacity-0'} bg-black transition-opacity duration-500`}></div>
      <div className="relative z-10 h-full">
        {children}
      </div>
      <div className="absolute bottom-6 right-6 flex space-x-reverse space-x-2 z-10">
        {images && images.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full ${i === current ? 'bg-white' : 'bg-gray-400'} opacity-80`}></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
