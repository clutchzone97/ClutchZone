import React, { useEffect, useRef, useState } from 'react';

interface Props {
  images: string[];
  heightClass?: string;
  intervalMs?: number;
  children?: React.ReactNode;
}

const HeroSlider: React.FC<Props> = ({ images, heightClass = 'h-screen', intervalMs = 3000, children }) => {
  const [current, setCurrent] = useState(0);
  const [overlay, setOverlay] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

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

  useEffect(() => {
    const container = listRef.current;
    const el = itemRefs.current[current];
    if (!container || !el) return;
    const left = el.offsetLeft;
    const width = el.offsetWidth;
    const target = left - (container.clientWidth - width) / 2;
    container.scrollTo({ left: target, behavior: 'smooth' });
  }, [current]);

  const bg = images && images.length ? images[current] : '';

  return (
    <div className={`relative ${heightClass} bg-cover bg-center text-white`} style={{ backgroundImage: `url('${bg}')` }}>
      <div className={`absolute inset-0 ${overlay ? 'opacity-60' : 'opacity-0'} bg-black transition-opacity duration-500`}></div>
      <div className="relative z-10 h-full">
        {children}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 md:bottom-5 z-10">
        <style>{`.cz-dots-scroll::-webkit-scrollbar{display:none}.cz-dots-scroll{-ms-overflow-style:none;scrollbar-width:none}`}</style>
        <div className="mx-auto max-w-[90%] overflow-hidden">
          <div
            ref={listRef}
            className="cz-dots-scroll pointer-events-auto flex justify-center gap-1.5 overflow-x-auto px-2 py-1 rounded-full bg-black/30 backdrop-blur"
            dir={typeof document !== 'undefined' ? document.documentElement.dir : undefined}
          >
            {Array.from({ length: images?.length || 0 }).map((_, idx) => {
              const isActive = idx === current;
              return (
                <span
                  key={idx}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  className={`rounded-full transition-all duration-200 ${isActive ? 'bg-white' : 'bg-white/50'}`}
                  style={{ width: isActive ? 26 : 10, height: 10 }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
