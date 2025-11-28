// src/pages/Store.tsx
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Zap, Star, TrendingUp, Gift, Clock } from 'lucide-react';

import Header from '../components/Header/Header';
import CountdownTimer from '../components/UI/CountdownTimer';
import { Button } from '../components/UI/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/UI/card';
import { useOffer } from '../context/OfferContext';

// ------------------------------------
// Types
// ------------------------------------

type LocalizedText = {
  ar: string;
  fr: string;
  en: string;
};

type Collection = {
  id: string;
  route: string;
  image: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  badge?: string;
  icon?: string;
};

// ------------------------------------
// Collections (3 بطاقات رئيسية)
// ------------------------------------

const collections: Collection[] = [
  {
    id: 'tshirts',
    route: '/collection/tshirts',
    image:
      'https://via.placeholder.com/600x400.png?text=Morocco+Football+T-Shirts',
    title: {
      ar: 'تيشرتات / تونيّات كرة القدم',
      fr: 'T-Shirts & Maillots',
      en: 'Football T-Shirts',
    },
    subtitle: {
      ar: 'قمصان رسمية وكاجوال مستوحاة من منتخب المغرب وفلسطين لعشّاق الكرة الصغار.',
      fr: 'Maillots officiels et casual inspirés du Maroc et de la Palestine.',
      en: 'Official and casual jerseys inspired by Morocco and Palestine.',
    },
    badge: 'NEW',
    icon: '👕',
  },
  {
    id: 'caps',
    route: '/collection/caps',
    image:
      'https://via.placeholder.com/600x400.png?text=Caps+and+Hats+Collection',
    title: {
      ar: 'قبّعات وكاسكيطات',
      fr: 'Caps & Hats',
      en: 'Caps & Hats',
    },
    subtitle: {
      ar: 'كاسكيطات، بونيّات و Bob Hats بألوان العلم المغربي والفلسطيني.',
      fr: 'Casquettes et bonnets aux couleurs du Maroc et de la Palestine.',
      en: 'Caps and beanies in Morocco & Palestine colors.',
    },
    badge: 'HOT',
    icon: '🧢',
  },
  {
    id: 'accessories',
    route: '/collection/accessories',
    image:
      'https://via.placeholder.com/600x400.png?text=Football+Accessories',
    title: {
      ar: 'إكسسوارات كرة القدم',
      fr: 'Football Accessories',
      en: 'Football Accessories',
    },
    subtitle: {
      ar: 'أعلام، شالات، صفّارات وإكسسوارات حماسية للمباريات الكبيرة.',
      fr: 'Écharpes, drapeaux, sifflets et accessoires pour les grands matchs.',
      en: 'Scarves, flags, whistles and more for big match days.',
    },
    badge: 'TOP',
    icon: '🎯',
  },
];

// ------------------------------------
// Component
// ------------------------------------

const Store = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { currentOffer, timeRemaining } = useOffer();

  // 🗣 اختيار اللغة لعنوان البطاقة
  const lang: keyof LocalizedText = i18n.language.startsWith('fr')
    ? 'fr'
    : i18n.language.startsWith('en')
    ? 'en'
    : 'ar';

  const pick = (text: LocalizedText) => text[lang];

  // ✅ هل عندنا عرض فعّال من العجلة؟
  const hasActiveOffer =
    currentOffer &&
    (currentOffer.type === 'discount' || currentOffer.type === 'shipping');

  let offerTitle = '';
  let offerDescription = '';

  if (currentOffer?.type === 'discount') {
    const value = currentOffer.value || 0;
    offerTitle =
      t('store.offer.discountTitle', `كل منتجاتك الآن بـ -${value}%`) ??
      `كل منتجاتك الآن بـ -${value}%`;
    offerDescription =
      t(
        'store.offer.discountDescription',
        'الخصم يُطبَّق تلقائيًا في سلة المشتريات قبل انتهاء الوقت.'
      ) ??
      'الخصم يُطبَّق تلقائيًا في سلة المشتريات قبل انتهاء الوقت.';
  } else if (currentOffer?.type === 'shipping') {
    offerTitle =
      t('store.offer.shippingTitle', 'توصيل مجاني على جميع طلباتك الحالية 🚚') ??
      'توصيل مجاني على جميع طلباتك الحالية 🚚';
    offerDescription =
      t(
        'store.offer.shippingDescription',
        'استمتع بالشحن المجاني إلى باب منزلك قبل انتهاء هذا العرض.'
      ) ??
      'استمتع بالشحن المجاني إلى باب منزلك قبل انتهاء هذا العرض.';
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* خلفية متحركة بالأشكال الهندسية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-2xl animate-float" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-44 h-44 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <Header />

      <main className="container mx-auto px-4 py-8 md:py-10 relative z-10">
        {/* 🔁 حزام متحرّك احترافي */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl"
               style={{
                 boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)',
               }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-blue-600 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-pink-600 to-transparent z-10" />
            <div className="relative px-6 py-4 overflow-hidden">
              <div className="whitespace-nowrap flex gap-12 text-sm md:text-base font-bold text-white animate-[marquee_25s_linear_infinite]">
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  شحن سريع داخل المغرب
                </span>
                <span className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  جودة ممتازة وخامات مريحة للأطفال
                </span>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  🇲🇦🇵🇸 تصاميم حصرية للمغرب وفلسطين
                </span>
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-300" />
                  خصومات إضافية من عجلة الحظ
                </span>
                <span className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-rose-300" />
                  عروض محدودة الكمية – سارع بالطلب
                </span>
                {/* تكرار للحركة المستمرة */}
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  شحن سريع داخل المغرب
                </span>
                <span className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  جودة ممتازة وخامات مريحة للأطفال
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* العنوان الرئيسي للمتجر */}
        <section className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-7xl font-black mb-4 animate-fadeIn"
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 25%, #ec4899 50%, #f59e0b 75%, #10b981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
              {t('store.chooseProducts', '⚽ اختر منتجاتك المفضلة')}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-slate-700 font-bold mt-4 max-w-3xl mx-auto"
             style={{ fontFamily: 'Cairo, sans-serif' }}>
            {t(
              'store.footballSubtitle',
              '🇲🇦 اكتشف جميع المنتجات الخاصة بكرة القدم المغربية والفلسطينية للأطفال 🇵🇸'
            )}
          </p>
        </section>

        {/* بانر العرض الاحترافي */}
        {hasActiveOffer && (
          <section className="mb-12 animate-slideDown">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-4 border-green-400 shadow-2xl px-8 py-6 md:px-12 md:py-8"
                 style={{
                   boxShadow: '0 25px 80px rgba(34, 197, 94, 0.35)',
                 }}>
              {/* تأثيرات الخلفية */}
              <div className="absolute -top-16 -left-16 h-32 w-32 rounded-full bg-green-300/40 blur-3xl animate-pulse" />
              <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-emerald-300/40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              {/* نجوم متلألئة */}
              <div className="absolute top-4 right-8 animate-spin-slow">
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="absolute bottom-4 left-8 animate-spin-slow" style={{ animationDelay: '0.5s' }}>
                <Star className="w-5 h-5 text-pink-500" />
              </div>

              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-sm font-black text-white mb-4 shadow-lg animate-bounce-slow">
                    <Gift className="w-5 h-5" />
                    <span>
                      {t(
                        'store.activeOffer',
                        '🎁 عرضك من عجلة الحظ مُفعَّل الآن'
                      )}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black mb-3"
                      style={{ 
                        fontFamily: 'Cairo, sans-serif',
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                    {offerTitle}
                  </h2>
                  <p className="text-base md:text-lg text-slate-700 font-semibold"
                     style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {offerDescription}
                  </p>
                </div>

                <div className="shrink-0">
                  <div className="relative flex items-center gap-4 rounded-2xl border-4 border-yellow-400 bg-white px-6 py-5 md:px-8 md:py-6 shadow-2xl"
                       style={{
                         boxShadow: '0 20px 50px rgba(234, 179, 8, 0.4)',
                       }}>
                    {/* تأثير وهج */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-100/50 to-orange-100/50 animate-pulse" />
                    
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-xl animate-pulse">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div className="relative flex flex-col">
                      <span className="text-xs md:text-sm text-slate-600 font-bold mb-1">
                        ينتهي العرض خلال
                      </span>
                      <span className="font-mono text-2xl md:text-3xl font-black tracking-wider bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        <CountdownTimer timeRemaining={timeRemaining} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3 بطاقات Collections احترافية */}
        <section className="mb-16">
          <div className="grid gap-10 md:grid-cols-3">
            {collections.map((col, index) => (
              <div
                key={col.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Card
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl hover:border-blue-400"
                  onClick={() => navigate(col.route)}
                >
                  {/* مؤشر الخصم الثابت في الأعلى */}
                  {hasActiveOffer && currentOffer?.type === 'discount' && (
                    <div className="absolute top-4 right-4 z-30 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 px-4 py-3 shadow-2xl border-2 border-white animate-bounce-slow"
                         style={{
                           boxShadow: '0 10px 40px rgba(239, 68, 68, 0.5)',
                         }}>
                      <Gift className="w-5 h-5 text-white" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white/90">خصم فعّال</span>
                        <span className="text-xl font-black text-white leading-none">
                          -{currentOffer.value}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* مؤشر الشحن المجاني */}
                  {hasActiveOffer && currentOffer?.type === 'shipping' && (
                    <div className="absolute top-4 right-4 z-30 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 shadow-2xl border-2 border-white animate-bounce-slow"
                         style={{
                           boxShadow: '0 10px 40px rgba(34, 197, 94, 0.5)',
                         }}>
                      <Gift className="w-5 h-5 text-white" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">شحن مجاني</span>
                        <span className="text-sm font-black text-white leading-none">🚚</span>
                      </div>
                    </div>
                  )}

                  {/* وهج عند الـ Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 rounded-3xl" />

                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl bg-gradient-to-br from-slate-100 to-slate-200">
                    <img
                      src={col.image}
                      alt={pick(col.title)}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                    
                    {/* الشارات */}
                    <div className="absolute left-5 top-5 flex items-center gap-3 z-20">
                      {col.badge && (
                        <span className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-sm font-black text-white shadow-xl border-2 border-white/70 animate-pulse">
                          {col.badge}
                        </span>
                      )}
                      <span className="rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-sm font-bold text-slate-800 border-2 border-slate-200">
                        ⚽ Kids
                      </span>
                    </div>

                    {/* الأيقونة الكبيرة */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 filter drop-shadow-2xl">
                      {col.icon}
                    </div>
                    
                    {/* المحتوى */}
                    <div className="absolute bottom-5 left-5 right-5 z-20">
                      <h3 className="text-2xl md:text-3xl font-black text-white drop-shadow-2xl mb-2 group-hover:text-yellow-300 transition-colors duration-300"
                          style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {pick(col.title)}
                      </h3>
                      <p className="text-sm md:text-base text-white font-semibold line-clamp-2 drop-shadow-lg"
                         style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {pick(col.subtitle)}
                      </p>
                    </div>
                  </div>

                  {/* Accessible header */}
                  <CardHeader className="sr-only">
                    <CardTitle>{pick(col.title)}</CardTitle>
                  </CardHeader>

                  <CardContent className="relative flex flex-1 flex-col justify-between px-6 pb-6 pt-5 z-10 bg-gradient-to-b from-white to-slate-50">
                    <p className="mb-4 text-sm md:text-base text-slate-600 font-semibold"
                       style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {t(
                        'store.collectionHint',
                        'اضغط لاكتشاف جميع المنتجات داخل هذه المجموعة.'
                      )}
                    </p>
                    <Button
                      size="lg"
                      className="relative mt-auto w-full rounded-2xl text-lg font-black text-white shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl overflow-hidden border-2 border-transparent group-hover:border-white/50"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(col.route);
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        {t('store.viewProducts', 'عرض المنتجات')}
                      </span>
                      {/* تأثير متوهج */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-40px) scale(1.15); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slideDown {
          animation: slideDown 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Store;