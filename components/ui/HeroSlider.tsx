import React, { useEffect, useState } from 'react';
import CarouselDots from './CarouselDots';

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
      <div className="pointer-events-none absolute inset-x-0 bottom-3 md:bottom-5 z-10">
        <CarouselDots total={images?.length || 0} activeIndex={current} />
      </div>
    </div>
  );
};

export default HeroSlider;
