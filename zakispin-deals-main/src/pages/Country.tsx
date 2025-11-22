import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

import Header from '../components/Header/Header';
import ProductGrid from '../components/Products/ProductGrid';
import CountdownTimer from '../components/UI/CountdownTimer';
import { Button } from '../components/UI/button';
import { Card, CardContent } from '../components/UI/card';
import { useOffer } from '../context/OfferContext';
import countriesData from '../data/countries.json';
import { cn } from '../lib/utils';

// --------------------------------------------------
// Types
// --------------------------------------------------

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  country: string;
  description: string;
}

// ✅ لائحة منتجات المغرب الخاصة بكرة القدم
const MA_FOOTBALL_PRODUCTS: Product[] = [
  {
    id: 'MA-1',
    name: 'Morocco Home Kids Jersey 24/25',
    price: 299,
    image: 'https://i.postimg.cc/s2JsH9Wj/image.png',
    country: 'MA',
    description:
      'Official home kids jersey in Morocco colors, light fabric and comfortable for everyday play.',
  },
  {
    id: 'MA-2',
    name: 'Morocco Away Kids Jersey 24/25',
    price: 279,
    image: 'https://via.placeholder.com/800x800?text=Morocco+Away+Kids+Jersey',
    country: 'MA',
    description:
      'Modern away jersey design, perfect for matches and going out with friends.',
  },
  {
    id: 'MA-3',
    name: 'Morocco Kids Goalkeeper Jersey',
    price: 259,
    image: 'https://via.placeholder.com/800x800?text=Goalkeeper+Jersey',
    country: 'MA',
    description:
      'Goalkeeper jersey with a unique colorway and extra comfort for young keepers.',
  },
  {
    id: 'MA-4',
    name: 'Morocco Kids Training Top',
    price: 199,
    image: 'https://via.placeholder.com/800x800?text=Training+Top',
    country: 'MA',
    description:
      'Lightweight training top, ideal for running, training and PE at school.',
  },
  {
    id: 'MA-5',
    name: 'Morocco Kids Full Kit (Jersey + Shorts)',
    price: 349,
    image: 'https://via.placeholder.com/800x800?text=Full+Kit',
    country: 'MA',
    description:
      'Complete kit for kids: jersey + shorts – perfect as a gift or for match days.',
  },
  {
    id: 'MA-6',
    name: 'Morocco Kids Hoodie',
    price: 279,
    image: 'https://via.placeholder.com/800x800?text=Morocco+Hoodie',
    country: 'MA',
    description:
      'Cozy hoodie for colder days, with Morocco crest printed on the chest.',
  },
  {
    id: 'MA-7',
    name: 'Morocco Kids Tracksuit',
    price: 399,
    image: 'https://via.placeholder.com/800x800?text=Tracksuit',
    country: 'MA',
    description:
      'High-quality full tracksuit for training, travel and everyday wear.',
  },
  {
    id: 'MA-8',
    name: 'Morocco Kids Lifestyle T-shirt',
    price: 149,
    image: 'https://via.placeholder.com/800x800?text=Lifestyle+T-shirt',
    country: 'MA',
    description:
      'Casual tee in Morocco colors, perfect for school and going out.',
  },
  {
    id: 'MA-9',
    name: 'Morocco Kids Shorts',
    price: 129,
    image: 'https://via.placeholder.com/800x800?text=Morocco+Shorts',
    country: 'MA',
    description:
      'Lightweight shorts with side stripes in national colors, made for football.',
  },
  {
    id: 'MA-10',
    name: 'Morocco Kids Warm-up Jacket',
    price: 289,
    image: 'https://via.placeholder.com/800x800?text=Warm-up+Jacket',
    country: 'MA',
    description:
      'Warm-up jacket inspired by the Atlas Lions, for before and after the game.',
  },
];

// --------------------------------------------------
// Component
// --------------------------------------------------

const Country = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { currentOffer, timeRemaining } = useOffer();

  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const productsPerPage = 12;

  const country = countriesData.find((c) => c.code === code);

  // ✅ نربط كود الدولة بالمنتجات الحقيقية ديالها
  useEffect(() => {
    if (!country || !code) return;

    let countryProducts: Product[] = [];

    switch (code) {
      case 'MA':
        countryProducts = MA_FOOTBALL_PRODUCTS;
        break;
      default:
        // fallback بسيط إلا زدتي دول أخرى ومازال ماعمّرناش داتا
        countryProducts = [];
    }

    setProducts(countryProducts);
    setDisplayedProducts(countryProducts.slice(0, productsPerPage));
    setPage(1);
  }, [code, country]);

  const loadMore = () => {
    const nextPage = page + 1;
    const start = page * productsPerPage;
    const end = start + productsPerPage;
    setDisplayedProducts((prev) => [...prev, ...products.slice(start, end)]);
    setPage(nextPage);
  };

  if (!country) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Country not found</h1>
          <Button onClick={() => navigate('/store')}>Back to Store</Button>
        </div>
      </div>
    );
  }

  const localizedName =
    country.name[i18n.language as keyof typeof country.name] || country.name.en;

  const heroTitle =
    country.heroTitle?.[i18n.language as keyof (typeof country)['heroTitle']] ||
    country.heroTitle?.en;

  const heroSubtitle =
    country.heroSubtitle?.[
      i18n.language as keyof (typeof country)['heroSubtitle']
    ] || country.heroSubtitle?.en;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* زر الرجوع */}
        <Button
          variant="ghost"
          onClick={() => navigate('/store')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back') || 'Back'}
        </Button>

        {/* 🔥 بطاقة هيرو كبيرة ومهنية لمنتجات المغرب */}
        <Card className="mb-10 overflow-hidden rounded-3xl border-0 shadow-2xl bg-gradient-to-br from-red-600 via-red-500 to-emerald-500 text-white">
          <div className="relative">
            {/* دوائر لبلور خلفية */}
            <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-black/25 blur-3xl" />

            <CardContent className="relative z-10 px-6 py-8 md:px-10 md:py-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-center">
                {/* النص */}
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-3xl md:text-4xl drop-shadow-sm">
                      {country.flag}
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                        {t('store.countryLabel') || 'Country'}
                      </p>
                      <h1 className="text-2xl font-black md:text-3xl">
                        {localizedName} Football
                      </h1>
                    </div>
                  </div>

                  {heroTitle && (
                    <p className="mb-2 text-lg font-semibold md:text-xl">
                      {heroTitle}
                    </p>
                  )}

                  {heroSubtitle && (
                    <p className="mb-4 max-w-xl text-sm md:text-base text-white/80">
                      {heroSubtitle}
                    </p>
                  )}

                  {/* highlights / chips */}
                  <div className="flex flex-wrap gap-2">
                    {(country.highlights as string[] | undefined)?.map(
                      (item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur"
                        >
                          {item}
                        </span>
                      )
                    )}
                    <span className="rounded-full bg-white text-xs font-semibold text-red-600 px-3 py-1 shadow-sm">
                      {country.productCount} {t('store.products') || 'products'}
                    </span>
                  </div>

                  {/* ⏰ كرونو كبير واحترافي للعرض المحدود */}
                  {currentOffer && (
                    <div className="mt-8 flex flex-col items-start gap-3">
                      <span className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-amber-100/80">
                        {t('store.limitedOffer') || 'Limited time offer'}
                      </span>

                      <div className="relative inline-flex items-center">
                        {/* زخارف جانبية */}
                        <span className="pointer-events-none absolute -left-4 h-7 w-7 rounded-full bg-amber-400/60 blur-md" />
                        <span className="pointer-events-none absolute -right-4 h-7 w-7 rounded-full bg-emerald-300/60 blur-md" />

                        <div className="relative flex items-center gap-4 rounded-full border border-white/40 bg-black/25 px-6 py-3 md:px-8 md:py-4 shadow-[0_14px_40px_rgba(15,23,42,0.75)] backdrop-blur-lg">
                          <div className="flex items-center gap-2 text-amber-200 text-sm md:text-base font-semibold">
                            <span className="text-lg md:text-2xl">⏰</span>
                            <span>
                              {t('store.offerEndsIn') || 'ينتهي العرض خلال'}
                            </span>
                          </div>

                          <div className="h-7 w-px bg-white/30" />

                          <div className="text-xl md:text-3xl font-black tracking-[0.25em] text-amber-50">
                            <CountdownTimer timeRemaining={timeRemaining} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* صورة جانبية تمثل قمصان المغرب */}
                <div className="mx-auto w-full max-w-[220px] md:max-w-[260px]">
                  <div
                    className={cn(
                      'aspect-[3/4] w-full rounded-2xl border border-white/25 shadow-2xl',
                      'bg-[url("https://i.postimg.cc/52w110MK/Whats-App-Image-2025-11-18-a-05-39-50-f0e2b1a1.jpg")] bg-cover bg-center'
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* شبكة المنتجات */}
        <ProductGrid products={displayedProducts} />

        {/* زر Load More */}
        {displayedProducts.length < products.length && (
          <div className="mt-10 text-center">
            <Button onClick={loadMore} size="lg" className="btn-primary">
              {t('country.loadMore') || 'Load more'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Country;
