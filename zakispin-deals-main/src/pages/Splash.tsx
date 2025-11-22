import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Splash = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login'); // ← الآن يمشي لصفحة تسجيل الدخول
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
      <div className="text-center animate-popup">
        {/* اللوجو */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-glow-lg animate-bounce">
            <span className="text-6xl font-bold text-gradient">S</span>
          </div>
        </div>

        {/* عنوان SpinShop */}
        <h1 className="text-5xl font-bold text-white mb-4 animate-fadeIn">
          SpinShop
        </h1>

        {/* Loading Text */}
        <p className="text-xl text-white/90 animate-fadeIn">
          {t('splash.loading')}
        </p>

        {/* 3 نقاط التحميل */}
        <div className="mt-8 flex gap-2 justify-center">
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
