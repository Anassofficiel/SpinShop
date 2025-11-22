// src/pages/Store.tsx
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from '../components/Header/Header';
import CountdownTimer from '../components/UI/CountdownTimer';
import { Button } from '../components/UI/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/UI/card';
import countriesData from '../data/countries.json';
import { useOffer } from '../context/OfferContext';
import { cn } from '../lib/utils';

const Store = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { currentOffer, timeRemaining } = useOffer();

  const getLocalizedName = (country: (typeof countriesData)[number]) =>
    country.name[i18n.language as keyof typeof country.name] || country.name.en;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <Header />

      {/* خلفية “بالونات” ملونة تتحرك بلُطف */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-70"
        aria-hidden="true"
      >
        <div className="absolute -top-32 left-10 h-56 w-56 rounded-full bg-pink-500/30 blur-3xl animate-pulse" />
        <div className="absolute -top-10 right-10 h-40 w-40 rounded-full bg-amber-400/35 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 h-60 w-60 rounded-full bg-sky-500/30 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-0 h-44 w-44 rounded-full bg-emerald-400/30 blur-3xl animate-pulse" />
      </div>

      <main className="container mx-auto px-4 py-10">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-sky-100 mb-3">
            {t('store.title') || 'اختر بلدك'}
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            {t('store.subtitle') || 'اكتشف منتجات من جميع أنحاء العالم'}
          </p>
        </div>

        {/* 🔥 كرونو كبير + رسالة متحركة تحتو */}
        {currentOffer && (
          <div className="flex flex-col items-center gap-4 mb-12">
            {/* الكرونو */}
            <div className="relative">
              {/* هالة / خيوط حول الكرونو */}
              <div
                className="pointer-events-none absolute -inset-6 bg-gradient-to-r from-amber-400/40 via-pink-400/25 to-sky-400/40 blur-2xl opacity-80"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -top-3 -left-10 h-8 w-8 rounded-full bg-amber-300/80 blur-md"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-4 -right-8 h-10 w-10 rounded-full bg-pink-400/80 blur-md"
                aria-hidden="true"
              />

              <div className="relative flex items-center gap-3 rounded-full bg-[#020617] px-6 py-3 md:px-9 md:py-4 shadow-[0_22px_60px_rgba(245,158,11,0.65)] border border-amber-300/40">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/90 text-[#111827] text-xl shadow-inner">
                  ⏰
                </span>
                <div className="flex flex-col items-start md:flex-row md:items-center md:gap-3">
                  <span className="text-xs md:text-sm font-semibold text-amber-100 whitespace-nowrap">
                    {/* نخلي النص ثابت بالعربية باش مايبانش key */}
                    ينتهي العرض خلال
                  </span>
                  <div className="text-lg md:text-2xl font-extrabold tracking-[0.35em] text-amber-50">
                    <CountdownTimer timeRemaining={timeRemaining} />
                  </div>
                </div>
              </div>
            </div>

            {/* جملة دعائية متحركة محاطة بباندة وردية / ذهبية */}
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-4 bg-gradient-to-r from-pink-500/30 via-rose-400/20 to-amber-300/30 blur-2xl opacity-80"
                aria-hidden="true"
              />
              <div className="relative flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 px-6 py-2 shadow-lg">
                <span className="text-xs md:text-sm font-bold text-white animate-pulse">
                  اختر منتجاتك واستفد من العرض قبل فوات الأوان ✨
                </span>
              </div>
            </div>
          </div>
        )}

        {/* شبكة الكروت ديال الدول */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {countriesData.map((country) => {
            const localizedName = getLocalizedName(country);
            const isMorocco = country.code === 'MA';

            const maTags = [
              'Goalkeeper Jerseys',
              'Training & Warm-up',
              'Kids full kits',
              'Kids Lifestyle & Hoodies',
              'Home & Away Kits',
            ];

            return (
              <Card
                key={country.code}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/country/${country.code}`)}
                className={cn(
                  'relative overflow-hidden rounded-3xl border-0 cursor-pointer transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_70px_rgba(0,0,0,0.55)]',
                  isMorocco
                    ? 'bg-gradient-to-br from-[#b91c1c] via-[#e11d48] to-[#16a34a] text-white shadow-[0_25px_70px_rgba(220,38,38,0.75)]'
                    : 'bg-slate-900/95 text-slate-50 shadow-[0_18px_40px_rgba(15,23,42,0.8)]'
                )}
              >
                {/* زخارف ضوئية */}
                {isMorocco && (
                  <>
                    <div className="pointer-events-none absolute -top-20 -left-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-10 h-52 w-52 rounded-full bg-black/30 blur-3xl" />
                  </>
                )}

                {/* دائرة كبيرة وسط الكارت بعلم المغرب / نجمة خضراء */}
                {isMorocco && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="h-40 w-40 rounded-full bg-[#b91c1c] border-2 border-white/70 flex items-center justify-center shadow-[0_0_40px_rgba(248,250,252,0.7)]">
                      <span className="text-6xl font-black text-emerald-400 drop-shadow-[0_0_20px_rgba(22,163,74,0.9)]">
                        ★
                      </span>
                    </div>
                  </div>
                )}

                <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-black/30 px-3 py-1 text-[11px] font-semibold tracking-[0.25em] uppercase text-slate-100">
                      {country.code}
                    </span>
                    <span className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase text-slate-100/90">
                      {(country as any).sportLabel || 'FOOTBALL'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-bold tracking-wide">
                      {country.code}
                    </span>
                    <span className="rounded-full bg-black/15 px-2.5 py-1 text-[11px] font-bold tracking-wide">
                      {country.code}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 px-6 pb-6">
                  {/* عنوان و عدد المنتجات */}
                  <div className="flex items-baseline justify-between mb-2">
                    <CardTitle className="text-2xl md:text-3xl font-black tracking-tight">
                      {localizedName}
                    </CardTitle>
                    <p className="text-xs md:text-sm font-medium text-slate-100/90">
                      {country.productCount} منتج
                    </p>
                  </div>

                  {/* وصف قصير */}
                  <p className="mb-4 text-xs md:text-sm leading-relaxed text-slate-50/90">
                    {isMorocco
                      ? 'قمصان الدار والإياب، حراس المرمى، أطقم التدريب وقطع كاجوال مستوحاة من أسود الأطلس لمحبّي كرة القدم الصغار.'
                      : country.description ||
                        'اكتشف تشكيلتنا المختارة من المنتجات الخاصة بهذا البلد.'}
                  </p>

                  {/* تاغات */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {(isMorocco ? maTags : country.highlights || []).map(
                      (tag) => (
                        <span
                          key={tag}
                          className={cn(
                            'rounded-full px-3 py-1 text-[11px] font-semibold',
                            isMorocco
                              ? 'bg-black/35 text-amber-100 border border-amber-200/40'
                              : 'bg-slate-800 text-slate-100 border border-slate-700'
                          )}
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>

                  {/* الزر مازال كاين، ولكن الكارت كامل كيتضغط */}
                  <div className="flex justify-end">
                    <Button
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation(); // باش مايتكرر الnavigate
                        navigate(`/country/${country.code}`);
                      }}
                      className={cn(
                        'rounded-full px-6 font-bold text-sm shadow-lg transition-transform hover:scale-105',
                        isMorocco
                          ? 'bg-white text-[#b91c1c] hover:bg-slate-100'
                          : 'bg-sky-500 text-white hover:bg-sky-600'
                      )}
                    >
                      {t('store.viewProducts') || 'عرض المنتجات'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Store;
