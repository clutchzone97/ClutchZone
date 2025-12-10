import React from "react";

interface CarouselDotsProps {
  total: number;
  activeIndex: number;
}

const CarouselDots: React.FC<CarouselDotsProps> = ({ total, activeIndex }) => {
  if (!total || total <= 1) return null;

  return (
    <div
      className="
        inline-flex items-center justify-center
        gap-1.5
        px-2 py-1
        rounded-full
        bg-black/30
        backdrop-blur
        mx-auto
        mt-2
      "
    >
      {Array.from({ length: total }).map((_, idx) => {
        const isActive = idx === activeIndex;
        return (
          <span
            key={idx}
            className={`
              h-1.5 rounded-full transition-all duration-200
              ${isActive ? "w-4 bg-white" : "w-1.5 bg-white/50"}
            `}
          />
        );
      })}
    </div>
  );
};

export default CarouselDots;
