import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../UI/card';

interface Country {
  code: string;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  flag: string;
  productCount: number;
}

interface CountryCardProps {
  country: Country;
}

const CountryCard = ({ country }: CountryCardProps) => {
  const { i18n, t } = useTranslation();
  const isMorocco = country.code === 'MA';

  const displayName =
    country.name[i18n.language as keyof typeof country.name] || country.name.en;

  // ✅ بطاقة خاصة بالمغرب (فوتبول ستايل)
  if (isMorocco) {
    return (
      <Link to={`/country/${country.code}`} className="w-full max-w-xl">
        <Card className="cursor-pointer overflow-hidden rounded-3xl border-0 shadow-2xl bg-gradient-to-br from-red-800 via-red-700 to-amber-500 relative h-80 sm:h-[22rem] transition-transform duration-300 hover:scale-[1.02]">
          {/* خلفية جيرسي شفافة */}
          <div
            className="absolute inset-0 opacity-35 sm:opacity-40 bg-cover bg-center mix-blend-multiply"
            style={{
              backgroundImage: 'url("https://i.postimg.cc/s2JsH9Wj/image.png")',
            }}
          />

          {/* طبقة غامقة خفيفة باش يبان النص */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

          <CardContent className="relative h-full p-6 sm:p-8 flex flex-col justify-between text-white">
            {/* الأعلى: العلم + الكود + الاسم */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-sm">
                  <span className="text-2xl">{country.flag}</span>
                  <span className="font-semibold tracking-widest">MA</span>
                </span>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-wide drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]">
                  {displayName}
                </h3>

                <p className="text-sm sm:text-base text-white/80">
                  {country.productCount} {t('store.products')}
                </p>
              </div>

              {/* شارة صغيرة فوقية فيها "Football" */}
              <span className="px-3 py-1 rounded-full bg-white/15 text-xs uppercase tracking-[0.2em] font-semibold">
                Football
              </span>
            </div>

            {/* الوسط: سطر تعريفي قصير */}
            <p className="text-sm sm:text-base text-white/90 max-w-md">
              {t('store.moroccoTeaser', {
                defaultValue:
                  'Kids jerseys, training kits and fan gear inspired by the Atlas Lions.',
              })}
            </p>

            {/* الأسفل: تاغات ديال أنواع المنتجات */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <span className="px-3 py-1 rounded-full bg-white/15 text-xs sm:text-sm font-medium">
                Home & away jerseys
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15 text-xs sm:text-sm font-medium">
                Kids full kits
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15 text-xs sm:text-sm font-medium">
                Training wear
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15 text-xs sm:text-sm font-medium">
                Accessories
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // 🔁 باقي الدول (ديزاين بسيط كلاسيكي)
  return (
    <Link to={`/country/${country.code}`} className="w-full max-w-sm">
      <Card className="card-hover cursor-pointer overflow-hidden bg-card rounded-2xl shadow-md transition-transform duration-200 hover:scale-[1.01]">
        <CardContent className="p-6 text-center">
          <div
            className="text-6xl mb-4 animate-bounce"
            style={{ animationDuration: '2s' }}
          >
            {country.flag}
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {displayName}
          </h3>
          <p className="text-muted-foreground">
            {country.productCount} {i18n.t('store.products')}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CountryCard;
