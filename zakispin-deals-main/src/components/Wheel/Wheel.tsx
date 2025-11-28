import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useOffer } from '../../context/OfferContext';
import { Button } from '../UI/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../UI/dialog';

import spinSound from '../../assets/spin.mp3';
import winSound from '../../assets/win.mp3';

// -----------------------------
// Types + sectors
// -----------------------------

type WheelSectorType = 'discount' | 'shipping' | 'retry' | 'none';

interface WheelSector {
  id: string;
  type: WheelSectorType;
  value?: number;
  color: string;
}

const WHEEL_SECTORS: WheelSector[] = [
  {
    id: 'discount-30',
    type: 'discount',
    value: 30,
    color: '#ff4757',
  },
  {
    id: 'discount-10',
    type: 'discount',
    value: 10,
    color: '#ffd93d',
  },
  {
    id: 'free-shipping',
    type: 'shipping',
    value: 0,
    color: '#6bcf7f',
  },
  {
    id: 'no-luck',
    type: 'none',
    value: 0,
    color: '#95a5a6',
  },
];

const Wheel = () => {
  const SPIN_DURATION = 12000;
  const TOTAL_SPINS = 30;

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { applyOffer, removeOffer } = useOffer();

  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [result, setResult] = useState<WheelSector | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [canRetry, setCanRetry] = useState(true);

  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    setShowResult(false);

    if (spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play().catch(() => {});
    }

    const randomSector =
      WHEEL_SECTORS[Math.floor(Math.random() * WHEEL_SECTORS.length)];

    const sectorAngle = 360 / WHEEL_SECTORS.length;
    const sectorIndex = WHEEL_SECTORS.findIndex(
      (s) => s.id === randomSector.id
    );

    const centerAngle = sectorIndex * sectorAngle + sectorAngle / 2;
    const targetRotation = 360 * TOTAL_SPINS + (180 - centerAngle);

    setWheelRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(randomSector);
      setShowResult(true);

      if (spinSoundRef.current) {
        spinSoundRef.current.pause();
        spinSoundRef.current.currentTime = 0;
      }

      if (
        randomSector.type === 'discount' ||
        randomSector.type === 'shipping'
      ) {
        if (winSoundRef.current) {
          winSoundRef.current.currentTime = 0;
          winSoundRef.current.play().catch(() => {});
        }

        const duration = 4000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: ['#C1272D', '#006233', '#FFD700', '#FFFFFF'],
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: ['#C1272D', '#006233', '#FFD700', '#FFFFFF'],
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();

        applyOffer({
          type: randomSector.type,
          value: randomSector.value ?? 0,
          label:
            randomSector.type === 'discount'
              ? randomSector.value === 30
                ? t(
                    'wheel.results.discount30',
                    'خصم 30% على جميع المنتجات'
                  )
                : t('wheel.results.discount10', 'خصم 10% على جميع المنتجات')
              : t(
                  'wheel.results.freeShipping',
                  'توصيل مجاني لكل الطلب 🎁'
                ),
        });

        setCanRetry(false);
      } else if (randomSector.type === 'none') {
        removeOffer();
        setCanRetry(false);
      } else {
        removeOffer();
        setCanRetry(true);
      }
    }, SPIN_DURATION);
  };

  const handleClose = () => {
    setShowResult(false);

    if (
      !canRetry ||
      result?.type === 'discount' ||
      result?.type === 'shipping'
    ) {
      navigate('/store');
    }
  };

  const getSectorLabel = (sector: WheelSector) => {
    switch (sector.type) {
      case 'discount':
        return sector.value === 30
          ? t('wheel.labels.discount30', 'خصم 30%')
          : t('wheel.labels.discount10', 'خصم 10%');
      case 'shipping':
        return t('wheel.labels.freeShipping', 'توصيل مجاني');
      case 'none':
      default:
        return t('wheel.labels.noLuck', 'لقد نفدت محاولتك');
    }
  };

  const getResultMessage = () => {
    if (!result) return '';

    if (result.type === 'discount') {
      if (result.value === 30) {
        return t(
          'wheel.results.discount30',
          '🎊 تهانينا! لقد ربحت خصم 30% 🎊'
        );
      }
      return t(
        'wheel.results.discount10',
        '🎉 مبروك! ربحت خصم 10% 🎉'
      );
    }

    if (result.type === 'shipping') {
      return t(
        'wheel.results.freeShipping',
        '🚚 رائع! توصيل مجاني لطلبك 🎁'
      );
    }

    if (result.type === 'none') {
      return t(
        'wheel.results.badLuck',
        'للأسف، المحاولة القادمة ستكون أفضل 💪'
      );
    }

    return t('wheel.results.retry', '😊 حاول مرة أخرى!');
  };

  const getResultDescription = () => {
    if (!result) return '';

    if (result.type === 'discount') {
      return t(
        'wheel.continueDiscount',
        'استمتع بخصمك الحصري على جميع منتجات المتجر'
      );
    }

    if (result.type === 'shipping') {
      return t(
        'wheel.continueShipping',
        'اشترِ الآن واستفد من التوصيل المجاني'
      );
    }

    if (result.type === 'none') {
      return t('wheel.tryLater', 'جرّب حظك مرة أخرى قريباً');
    }

    return t('wheel.continue', 'توجّه للمتجر لمتابعة التسوّق');
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
  
      {/* هنا تحط الخلفية */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `repeating-conic-gradient(
            from 0deg,
            orangered,
            transparent 10deg,
            orange 10deg,
            orangered 20deg
          )`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundColor: "orange"
        }}
      />
  
  

{/* العنوان بالعربية */}
<div className="text-center mb-16 relative z-10 animate-fadeIn">
        <h1 className="text-6xl md:text-8xl font-black mb-6 drop-shadow-2xl" 
            style={{
              fontFamily: 'Cairo, Tajawal, sans-serif',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFFFFF 25%, #C1272D 50%, #006233 75%, #FFFFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(255,255,255,0.6)',
            }}>
          {t('wheel.title', '⚽ دوّر العجلة واربح ⚽')}
        </h1>
        <p className="text-2xl md:text-3xl font-black text-white drop-shadow-2xl px-4" 
           style={{ 
             fontFamily: 'Cairo, sans-serif',
             textShadow: '3px 3px 6px rgba(0,0,0,0.5), 0 0 20px rgba(193,39,45,0.8)',
           }}>
          {t('wheel.subtitle', 'اربح خصومات حصرية على ملابس كرة القدم المفضلة لديك! 🎯')}
        </p>
      </div>



      {/* CONTAINER العام للعجلة */}
      <div className="relative w-[360px] h-[460px] md:w-[440px] md:h-[540px] mb-12 flex flex-col items-center justify-center z-10">
        {/* إطار خارجي */}
        <div className="relative w-[360px] h-[360px] md:w-[440px] md:h-[440px]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-[0_0_80px_rgba(0,0,0,0.9),0_0_120px_rgba(193,39,45,0.5)]" />
          
          {/* حلقة ذهبية مغربية */}
          <div className="absolute inset-[-10px] rounded-full animate-rotate-slow" 
               style={{
                 background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 25%, #FFD700 50%, #FFA500 75%, #FFD700 100%)',
                 padding: '5px',
               }}>
            <div className="w-full h-full rounded-full bg-gray-900" />
          </div>

          {/* القرص الملون */}
          <div
            className="absolute inset-[16px] rounded-full shadow-2xl overflow-hidden flex items-center justify-center"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              transition: spinning
                ? `transform ${SPIN_DURATION / 1000}s cubic-bezier(0.17, 0.67, 0.15, 1)`
                : 'none',
            }}
          >
            {/* الخلفية بالألوان */}
            <div
              className="absolute inset-0"
              style={{
                background: `conic-gradient(
                  ${WHEEL_SECTORS[0].color} 0deg 90deg,
                  ${WHEEL_SECTORS[1].color} 90deg 180deg,
                  ${WHEEL_SECTORS[2].color} 180deg 270deg,
                  ${WHEEL_SECTORS[3].color} 270deg 360deg
                )`,
              }}
            />

            {/* خطوط فاصلة بيضاء */}
            <div className="absolute inset-0">
              {[0, 90, 180, 270].map((angle) => (
                <div
                  key={angle}
                  className="absolute top-1/2 left-1/2 w-[8px] h-full bg-black origin-top shadow-lg"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  }}
                />
              ))}
            </div>

            {/* النصوص داخل القطاعات */}
            {WHEEL_SECTORS.map((sector, index) => {
              const sectorAngle = 360 / WHEEL_SECTORS.length;
              const centerAngle = index * sectorAngle + sectorAngle / 2;

              return (
                <div
                  key={sector.id}
                  className="absolute inset-0 flex items-start justify-center"
                  style={{ transform: `rotate(${centerAngle}deg)` }}
                >
                  <span
                    className="text-[28px] md:text-[38px] font-black text-black text-center leading-tight"
                    style={{
                      transform: `rotate(${-centerAngle}deg)`,
                      marginTop: '13%',
                      maxWidth: '140px',
                      fontFamily: 'Cairo, sans-serif',
                      textShadow: '3px 3px 10px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.7)',
                      WebkitTextStroke: '2px rgba(0,0,0,0.4)',
                    }}
                  >
                    {getSectorLabel(sector)}
                  </span>
                </div>
              );
            })}

          {/* أيقونة كرة القدم في الوسط */}
<div className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full 
     bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 
     border-[5px] border-white flex items-center justify-center 
     shadow-[0_0_25px_rgba(251,191,36,0.8),0_0_40px_rgba(255,215,0,0.5)]">

  <span className="text-4xl md:text-5xl">⚽</span>
</div>

          </div>
        </div>

 {/* السهم الأزرق الاحترافي */}
<div 
  className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center"
  style={{ bottom: "-30px" }}
>
  {/* جسم السهم */}
  <div className="w-[14px] h-[85px] rounded-full shadow-2xl relative overflow-hidden">
    {/* التدرج الأزرق الجديد */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A] via-[#3B82F6] to-[#60A5FA] animate-pulse" />
    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent" />
  </div>

  {/* رأس السهم */}
  <div
    className="relative"
    style={{
      marginTop: "-4px",
      filter: "drop-shadow(0 8px 20px rgba(30,58,138,0.9))",
    }}
  >
    <div
      className="w-0 h-0 border-l-[28px] border-r-[28px] border-b-[42px] border-l-transparent border-r-transparent"
      style={{
        borderBottomColor: "#1E3A8A", // الأزرق الملكي
        filter: "drop-shadow(0 6px 15px rgba(0,0,0,0.8))",
      }}
    />
  </div>
</div>
</div>

      {/* الزر مع تأثير Hover */}
      <div className="relative mt-8 z-10">
        <Button
          onClick={spinWheel}
          disabled={spinning || (!canRetry && result?.type === 'none')}
          size="lg"
          className="spin-button px-24 py-8 text-3xl font-black rounded-full border-[6px] border-white relative overflow-hidden group transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #C1272D 0%, #006233 50%, #FFD700 100%)',
            boxShadow: '0 20px 50px rgba(193,39,45,0.8), 0 0 80px rgba(0,98,51,0.5)',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <span className="relative z-10 drop-shadow-2xl text-white">
            {spinning
              ? t('wheel.spinning', '⚡ جاري التدوير...')
              : t('wheel.spin', '🎯 دوّر الآن!')}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 group-hover:animate-shimmer" />
        </Button>

        {!spinning && !result && (
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-14 animate-bounce">
            <span className="text-6xl drop-shadow-2xl">👆</span>
          </div>
        )}
      </div>

      {/* عناصر الصوت */}
      <audio ref={spinSoundRef} src={spinSound} preload="auto" className="hidden" />
      <audio ref={winSoundRef} src={winSound} preload="auto" className="hidden" />

      {/* حوار النتيجة */}
      <Dialog open={showResult} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md border-[6px] shadow-2xl" 
                       style={{
                         borderColor: result?.type === 'discount' || result?.type === 'shipping' ? '#FFD700' : '#95a5a6',
                         background: result?.type === 'discount' || result?.type === 'shipping'
                           ? 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 50%, #ffeaa7 100%)'
                           : 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%)',
                       }}>
          <DialogHeader>
            <DialogTitle className="text-4xl md:text-5xl text-center font-black py-6"
                         style={{
                           fontFamily: 'Cairo, sans-serif',
                           color: result?.type === 'discount' || result?.type === 'shipping' ? '#C1272D' : '#2d3436',
                           textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                         }}>
              {getResultMessage()}
            </DialogTitle>
            <DialogDescription className="text-center text-2xl md:text-3xl pt-8 pb-6 font-bold"
                               style={{
                                 fontFamily: 'Cairo, sans-serif',
                                 color: result?.type === 'discount' || result?.type === 'shipping' ? '#006233' : '#636e72',
                               }}>
              {getResultDescription()}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-8 pb-6">
            <Button 
              onClick={handleClose} 
              size="lg" 
              className="px-16 py-7 text-2xl font-black rounded-full border-4 border-white shadow-2xl"
              style={{
                background: result?.type === 'discount' || result?.type === 'shipping'
                  ? 'linear-gradient(90deg, #006233 0%, #00b894 100%)'
                  : 'linear-gradient(90deg, #C1272D 0%, #e17055 100%)',
                fontFamily: 'Cairo, sans-serif',
              }}>
              {result?.type === 'none' && canRetry
                ? t('wheel.retry', '🔄 محاولة أخرى')
                : t('wheel.continue', '⚽ تسوق الآن')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .moroccan-bg {
          background: linear-gradient(135deg, 
            rgba(193, 39, 45, 0.15) 0%, 
            rgba(0, 98, 51, 0.15) 25%, 
            rgba(255, 255, 255, 0.1) 50%, 
            rgba(0, 98, 51, 0.15) 75%, 
            rgba(193, 39, 45, 0.15) 100%
          ),
          linear-gradient(45deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-40px) scale(1.15); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .spin-button:hover {
          transform: scale(1.15) !important;
          box-shadow: 0 25px 60px rgba(193,39,45,0.9), 0 0 100px rgba(255,215,0,0.7) !important;
        }
        
        .spin-button:active {
          transform: scale(1.05) !important;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .group:hover .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Wheel;