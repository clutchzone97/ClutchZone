import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useTranslation } from "react-i18next";

const WakeServerOverlay: React.FC = () => {
  const { t } = useTranslation();
  const [isSleeping, setIsSleeping] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [visible, setVisible] = useState(true);

  const checkServer = async () => {
    try {
      await api.get("/health");
      setIsSleeping(false);

      // Fade-out animation
      setTimeout(() => setVisible(false), 300);
    } catch {
      setIsSleeping(true);
    }
  };

  useEffect(() => {
    checkServer();

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          checkServer();
          return 10;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={` 
        fixed inset-0 bg-black bg-opacity-80 
        flex items-center justify-center text-white 
        z-[999999] transition-opacity duration-300 
        ${isSleeping ? "opacity-100" : "opacity-0"} 
      `}
    >
      <div className="text-center px-6">
        {/* Loader Animation */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h2 className="text-3xl font-bold mb-4">
          {t('waking_server_title')}
        </h2>

        <p className="text-lg leading-relaxed mb-4">
          {t('server_sleeping')}
          <br />
          {t('wake_time_hint')}
        </p>

        <p className="text-sm opacity-80 mb-4">
          {t('retry_in_seconds', { countdown })}
        </p>

        <button
          onClick={checkServer}
          className=" 
            bg-blue-600 hover:bg-blue-700 
            px-6 py-2 rounded-md text-white font-semibold 
            transition-transform duration-200 hover:scale-105 
          "
        >
          {t('retry_now')}
        </button>
      </div>
    </div>
  );
};

export default WakeServerOverlay;
