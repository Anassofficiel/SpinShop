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

import spinSound from '../../assets/spin.mp3'; // 🔊 صوت دوران العجلة
import winSound from '../../assets/win.mp3'; // 🔊 صوت الفوز الجديد

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
    color: '#ff4757', // أحمر قوي
  },
  {
    id: 'free-shipping',
    type: 'shipping',
    value: 0,
    color: '#f1c40f', // أصفر ذهبي
  },
  {
    id: 'retry',
    type: 'retry',
    value: 0,
    color: '#2ecc71', // أخضر واضح
  },
  {
    id: 'no-luck',
    type: 'none',
    value: 0,
    color: '#7f8c8d', // رمادي غامق
  },
];

const Wheel = () => {
  const SPIN_DURATION = 40000; // مدة الدوران بالميلي ثانية = 10 ثواني
  const TOTAL_SPINS = 12; // 🔄 عدد الدورات الكاملة قبل التوقف (باش يدور بزربة)
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { applyOffer, removeOffer } = useOffer();

  const [spinning, setSpinning] = useState(false);
  const [pointerRotation, setPointerRotation] = useState(0);
  const [result, setResult] = useState<WheelSector | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [canRetry, setCanRetry] = useState(true);

  // 🔊 مراجع الأصوات
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    // نشغّل صوت الدوران
    if (spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play().catch(() => {
        // بعض المتصفحات كيرفضو اللعب تلقائياً، نتجاهلو الخطأ
      });
    }

    // نختار قطاع عشوائي من الأربعة
    const randomSector =
      WHEEL_SECTORS[Math.floor(Math.random() * WHEEL_SECTORS.length)];

    const sectorAngle = 360 / WHEEL_SECTORS.length; // 90°
    const sectorIndex = WHEEL_SECTORS.findIndex(
      (s) => s.id === randomSector.id
    );

    // نخلي السهم يدور بزاف الدورات + يوقف فوسط القطاع الرابح
    const targetRotation =
      360 * TOTAL_SPINS + sectorIndex * sectorAngle + sectorAngle / 2 - 180;

    setPointerRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(randomSector);
      setShowResult(true);

      // نوقف صوت الدوران
      if (spinSoundRef.current) {
        spinSoundRef.current.pause();
        spinSoundRef.current.currentTime = 0;
      }

      // 🎉 صوت الفوز إذا كان شي نتيجة ماشي "لقد نفدت محاولتك"
      if (
        randomSector.type === 'discount' ||
        randomSector.type === 'shipping' ||
        randomSector.type === 'retry'
      ) {
        if (winSoundRef.current) {
          winSoundRef.current.currentTime = 0;
          winSoundRef.current.play().catch(() => {
            // نتجاهل خطأ autoplay
          });
        }
      }

      // ✅ التخفيض + التوصيل المجاني → نطبّق العرض + confetti
      if (
        randomSector.type === 'discount' ||
        randomSector.type === 'shipping'
      ) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });

        applyOffer({
          type: randomSector.type,
          value: randomSector.type === 'discount' ? randomSector.value ?? 0 : 0,
          label:
            randomSector.type === 'discount'
              ? t('wheel.results.discount30', 'خصم 30% على جميع المنتجات')
              : t('wheel.results.freeShipping', 'توصيل مجاني لكل الطلب'),
        });

        setCanRetry(false);
      }
      // 🔁 "حاول مرة أخرى" → ماكاين حتى عرض مفعّل، غير نخليه يعاود
      else if (randomSector.type === 'retry') {
        removeOffer(); // مهم: نحيد أي عرض قديم
        setCanRetry(true);
      }
      // ❌ "لقد نفدت محاولتك" → نحيد أي عرض (لا خصم لا توصيل مجاني)
      else {
        removeOffer();
        setCanRetry(false);
      }
    }, SPIN_DURATION); // دوران لحوالي 10 ثواني
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
        return t('wheel.labels.discount30', 'خصم 30%');
      case 'shipping':
        return t('wheel.labels.freeShipping', 'توصيل مجاني');
      case 'retry':
        return t('wheel.labels.retry', 'حاول مرة أخرى');
      case 'none':
      default:
        return t('wheel.labels.noLuck', 'لقد نفدت محاولتك');
    }
  };

  const getResultMessage = () => {
    if (!result) return '';

    switch (result.type) {
      case 'discount':
        return t(
          'wheel.results.discount30',
          'مبروك! ربحت خصم 30% على جميع المنتجات 🎉'
        );
      case 'shipping':
        return t(
          'wheel.results.freeShipping',
          'مبروك! ربحت توصيل مجاني على طلبك 🎉'
        );
      case 'retry':
        return t('wheel.results.retry', '😊 حاول مرة أخرى!');
      case 'none':
      default:
        return t(
          'wheel.results.badLuck',
          'للأسف، لقد نفدت محاولتك. جرّب حظك مرة أخرى لاحقاً 🙏'
        );
    }
  };

  const getResultDescription = () => {
    if (!result) return '';

    if (result.type === 'retry' && canRetry) {
      return t('wheel.retry', 'محاولة أخرى');
    }

    if (result.type === 'discount') {
      return t(
        'wheel.continueDiscount',
        'توجّه للمتجر لاستعمال خصم 30% على جميع المنتجات.'
      );
    }

    if (result.type === 'shipping') {
      return t(
        'wheel.continueShipping',
        'توجّه للمتجر للاستفادة من التوصيل المجاني.'
      );
    }

    if (result.type === 'none') {
      return t('wheel.tryLater', 'يمكنك تجربة حظك مرة أخرى في وقت لاحق.');
    }

    return t('wheel.continue', 'توجّه للمتجر لمتابعة التسوّق.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#fff4f4] via-[#f1f5ff] to-[#ffeefd]">
      {/* العنوان */}
      <div className="text-center mb-10 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">
          {t('wheel.title', 'اربح عرضك الخاص!')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('wheel.subtitle', 'قم بتدوير العجلة واحصل على خصومات مذهلة.')}
        </p>
      </div>

      {/* العجلة */}
      <div className="relative w-[320px] h-[320px] md:w-[360px] md:h-[360px] mb-10">
        {/* إطار خارجي */}
        <div className="absolute inset-0 rounded-full bg-[#0b1120] shadow-[0_18px_45px_rgba(15,23,42,0.6)]" />

        {/* القرص الملون (ثابت) */}
        <div className="absolute inset-[10px] rounded-full bg-[#fff1d6] shadow-inner overflow-hidden flex items-center justify-center">
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
                  className="text-[28px] md:text-[19px] font-extrabold text-[#111827] drop-shadow-[0_2px_4px_rgba(255,255,255,0.95)] text-center leading-tight"
                  style={{
                    transform: `rotate(${-centerAngle}deg)`,
                    marginTop: '12%',
                    maxWidth: '125px',
                  }}
                >
                  {getSectorLabel(sector)}
                </span>
              </div>
            );
          })}

          {/* اللوغو + السهم (يدور) */}
          <div
            className="relative flex flex-col items-center justify-center pointer-events-none z-10"
            style={{
              transform: `rotate(${pointerRotation}deg)`,
              // ✅ دوران سريع في البداية وبطيء في النهاية (ease-out قوي)
              transition: `transform ${
                SPIN_DURATION / 2000
              }s cubic-bezier(0.12, 0.9, 0.18, 1)`,
            }}
          >
            <span className="text-4xl md:text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] mb-1">
              🎡
            </span>
            <div className="w-0 h-0 border-l-[9px] border-r-[9px] border-t-[22px] border-l-transparent border-r-transparent border-t-[#111827] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
          </div>
        </div>
      </div>

      {/* الزر + اليد */}
      <div className="relative mt-2">
        <Button
          onClick={spinWheel}
          disabled={spinning || (!canRetry && result?.type === 'none')}
          size="lg"
          className="
            px-16 py-5 text-xl font-bold rounded-full border-0
            shadow-[0_12px_30px_rgba(248,113,113,0.75)]
            transition-all duration-300 ease-out
            hover:scale-110 hover:shadow-[0_18px_45px_rgba(248,113,113,0.9)]
            active:scale-95
          "
          style={{
            background:
              'linear-gradient(90deg, #ff5f8a 0%, #ff8a3c 50%, #ff5f8a 100%)',
          }}
        >
          {spinning
            ? t('wheel.spinning', 'جاري التدوير...')
            : t('wheel.spin', 'تدوير')}
        </Button>

        {!spinning && !result && (
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 animate-bounce">
            <span className="text-4xl">👆</span>
          </div>
        )}
      </div>

      {/* عناصر الصوت */}
      <audio
        ref={spinSoundRef}
        src={spinSound}
        preload="auto"
        className="hidden"
      />
      <audio
        ref={winSoundRef}
        src={winSound}
        preload="auto"
        className="hidden"
      />

      {/* حوار النتيجة */}
      <Dialog open={showResult} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              {getResultMessage()}
            </DialogTitle>
            <DialogDescription className="text-center text-lg pt-4">
              {getResultDescription()}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={handleClose} size="lg" className="btn-primary">
              {result?.type === 'retry' && canRetry
                ? t('wheel.retry', 'محاولة أخرى')
                : t('wheel.continue', 'الانتقال إلى المتجر')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wheel;
