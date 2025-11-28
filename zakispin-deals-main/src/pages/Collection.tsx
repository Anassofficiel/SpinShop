// src/pages/Collection.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, Heart, Star, Sparkles, Gift, Truck } from 'lucide-react';

import Header from '../components/Header/Header';
import { Button } from '../components/UI/button';
import { useOffer } from '../context/OfferContext';

// ✅ Types للمنتجات
interface SimpleProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  rating?: number;
  reviews?: number;
}

// ✅ المنتجات لكل مجموعة
const COLLECTION_PRODUCTS: Record<string, SimpleProduct[]> = {
  tshirts: [
    {
      id: 'MA-1',
      name: 'Morocco Home Kids Jersey 24/25',
      price: 249,
      originalPrice: 349,
      image: 'https://i.postimg.cc/s2JsH9Wj/image.png',
      rating: 4.8,
      reviews: 156,
    },
    {
      id: 'MA-2',
      name: 'Morocco Away Kids Jersey 24/25',
      price: 279,
      originalPrice: 399,
      image: 'https://via.placeholder.com/800x800?text=Morocco+Away+Kids+Jersey',
      rating: 4.7,
      reviews: 142,
    },
    {
      id: 'MA-3',
      name: 'Morocco Kids Training Top',
      price: 199,
      originalPrice: 279,
      image: 'https://via.placeholder.com/800x800?text=Training+Top',
      rating: 4.6,
      reviews: 98,
    },
    {
      id: 'MA-8',
      name: 'Morocco Kids Lifestyle T-shirt',
      price: 149,
      originalPrice: 219,
      image: 'https://via.placeholder.com/800x800?text=Lifestyle+T-shirt',
      rating: 4.5,
      reviews: 87,
    },
  ],
  caps: [
    {
      id: 'MA-4',
      name: 'Morocco Kids Hoodie',
      price: 279,
      originalPrice: 389,
      image: 'https://via.placeholder.com/800x800?text=Morocco+Hoodie',
      rating: 4.9,
      reviews: 203,
    },
    {
      id: 'MA-5',
      name: 'Morocco Kids Shorts',
      price: 129,
      originalPrice: 189,
      image: 'https://via.placeholder.com/800x800?text=Morocco+Shorts',
      rating: 4.6,
      reviews: 124,
    },
    {
      id: 'MA-6',
      name: 'Morocco Kids Full Kit',
      price: 349,
      originalPrice: 499,
      image: 'https://via.placeholder.com/800x800?text=Full+Kit',
      rating: 4.8,
      reviews: 167,
    },
  ],
  accessories: [
    {
      id: 'MA-7',
      name: 'Morocco Goalkeeper Kids Jersey',
      price: 259,
      originalPrice: 359,
      image: 'https://via.placeholder.com/800x800?text=Goalkeeper+Jersey',
      rating: 4.7,
      reviews: 89,
    },
    {
      id: 'MA-9',
      name: 'Morocco Kids Tracksuit',
      price: 399,
      originalPrice: 549,
      image: 'https://via.placeholder.com/800x800?text=Tracksuit',
      rating: 4.9,
      reviews: 178,
    },
    {
      id: 'MA-10',
      name: 'Morocco Kids Zip Hoodie',
      price: 289,
      originalPrice: 399,
      image: 'https://via.placeholder.com/800x800?text=Zip+Hoodie',
      rating: 4.8,
      reviews: 145,
    },
  ],
};

const Collection = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { currentOffer } = useOffer();

  const products = (slug && COLLECTION_PRODUCTS[slug.toLowerCase()]) || [];

  // ✅ العناوين والأوصاف
  const titles: Record<string, { ar: string; fr: string; en: string }> = {
    tshirts: {
      ar: 'تيشرتات / تونيّات كرة القدم',
      fr: 'T-Shirts & Maillots',
      en: 'Football T-Shirts',
    },
    caps: {
      ar: 'قبّعات وكاسكيطات',
      fr: 'Caps & Hats',
      en: 'Caps & Hats',
    },
    accessories: {
      ar: 'إكسسوارات كرة القدم',
      fr: 'Accessoires de football',
      en: 'Football Accessories',
    },
  };

  const subtitles: typeof titles = {
    tshirts: {
      ar: 'مجموعة قمصان وتيشرتات مخصّصة لعشّاق الكرة الصغار.',
      fr: 'Collection de maillots et t-shirts pour les kids.',
      en: 'Collection of football jerseys & tees for kids.',
    },
    caps: {
      ar: 'كاسكيطات وبونيّات بألوان المنتخب.',
      fr: 'Casquettes et bonnets aux couleurs de l\'équipe.',
      en: 'Caps & beanies in team colors.',
    },
    accessories: {
      ar: 'أعلام، شالات وإكسسوارات حماسية للمباريات.',
      fr: 'Écharpes, drapeaux et accessoires pour les matchs.',
      en: 'Scarves, flags & match-day accessories.',
    },
  };

  // ✅ اختيار اللغة
  const lang = i18n.language.startsWith('fr')
    ? 'fr'
    : i18n.language.startsWith('en')
    ? 'en'
    : 'ar';

  const title = slug && titles[slug]
    ? titles[slug][lang]
    : t('collection.title', 'المجموعة');

  const subtitle = slug && subtitles[slug]
    ? subtitles[slug][lang]
    : '';

  // ✅ حساب السعر بعد الخصم من العجلة
  const calculateFinalPrice = (price: number) => {
    if (currentOffer?.type === 'discount' && currentOffer.value) {
      return Math.round(price * (1 - currentOffer.value / 100));
    }
    return price;
  };

  // ✅ التحقق من نوع العرض
  const hasWheelDiscount = currentOffer?.type === 'discount';
  const hasFreeShipping = currentOffer?.type === 'shipping';
  const noOffer = currentOffer?.type === 'no_luck';

  // ✅ إذا المجموعة غير موجودة
  if (!slug || products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/store')}
            className="mb-6 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            رجوع
          </Button>

          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-2 text-slate-800">
              المجموعة غير متوفّرة
            </h1>
            <p className="text-slate-600 mb-4">
              ربما تم تغيير الرابط أو لم نضف بعد منتجات لهذه المجموعة.
            </p>
            <Button onClick={() => navigate('/store')}>
              العودة إلى المتجر
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* ✅ خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl animate-float" />
        <div className="absolute top-60 right-20 w-48 h-48 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-40 left-1/4 w-44 h-44 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 right-1/3 w-36 h-36 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-3xl animate-float" />
      </div>

      <Header />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* ✅ زر الرجوع */}
        <Button
          variant="ghost"
          onClick={() => navigate('/store')}
          className="mb-6 hover:bg-slate-100 text-slate-700 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          رجوع
        </Button>

        {/* ✅ عنوان المجموعة */}
        <section className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-5 py-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-blue-700">
              {products.length} منتج متوفر
            </span>
          </div>
          
          <h1 
            className="text-4xl md:text-6xl font-black mb-4 animate-fadeIn"
            style={{
              fontFamily: 'Cairo, sans-serif',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </h1>
          
          {subtitle && (
            <p 
              className="text-lg md:text-xl text-slate-600 font-semibold max-w-2xl mx-auto"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {subtitle}
            </p>
          )}

          {/* ✅ إشعار العرض من العجلة */}
          {hasWheelDiscount && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 shadow-xl animate-pulse">
              <Gift className="w-5 h-5 text-white" />
              <span className="text-sm font-black text-white">
                🎉 خصم {currentOffer.value}% مُفعَّل من عجلة الحظ
              </span>
            </div>
          )}

          {hasFreeShipping && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 shadow-xl animate-pulse">
              <Truck className="w-5 h-5 text-white" />
              <span className="text-sm font-black text-white">
                🚚 توصيل مجاني مُفعَّل من عجلة الحظ
              </span>
            </div>
          )}
        </section>

        {/* ✅ شبكة المنتجات */}
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => {
            // حساب خصم البطاقة الأصلي
            const originalDiscount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            // السعر النهائي بعد خصم العجلة
            const finalPrice = calculateFinalPrice(product.price);
            const wheelSavings = product.price - finalPrice;

            return (
              <div
                key={product.id}
                className="group animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-400 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {/* ✅ شارات في الأعلى */}
                  <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between gap-2">
                    {/* شارة الخصم الأصلي */}
                    {originalDiscount > 0 && (
                      <div className="rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-3 py-1.5 shadow-xl border-2 border-white">
                        <span className="text-xs font-black text-white">
                          -{originalDiscount}%
                        </span>
                      </div>
                    )}

                    {/* شارة خصم العجلة */}
                    {hasWheelDiscount && (
                      <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 shadow-xl border-2 border-white animate-bounce-slow">
                        <span className="text-xs font-black text-white">
                          🎁 -{currentOffer.value}%
                        </span>
                      </div>
                    )}

                    {/* شارة الشحن المجاني */}
                    {hasFreeShipping && (
                      <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1.5 shadow-xl border-2 border-white animate-bounce-slow">
                        <span className="text-xs font-black text-white">
                          🚚 مجاني
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ✅ زر المفضلة */}
                  <button
                    className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:bg-red-50 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Heart className="w-5 h-5 text-slate-600 hover:text-red-500 transition-colors" />
                  </button>

                  {/* ✅ صورة المنتج */}
                  <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* ✅ معلومات المنتج */}
                  <div className="flex flex-col p-5 bg-gradient-to-b from-white to-slate-50">
                    {/* التقييم */}
                    {product.rating && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating!)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          ({product.reviews})
                        </span>
                      </div>
                    )}

                    {/* اسم المنتج */}
                    <h3 
                      className="text-base md:text-lg font-bold text-slate-800 mb-3 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors"
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    >
                      {product.name}
                    </h3>

                    {/* ✅ الأسعار - حسب حالة العجلة */}
                    <div className="flex flex-col gap-2 mb-4">
                      {/* حالة 1: لقد نفدت محاولاتك - السعر الأصلي بالأخضر */}
                      {noOffer && (
                        <div className="flex flex-col">
                          <span 
                            className="text-3xl md:text-4xl font-black text-green-600"
                            style={{ fontFamily: 'Cairo, sans-serif' }}
                          >
                            {product.price} MAD
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm font-semibold text-slate-400 line-through">
                              {product.originalPrice} MAD
                            </span>
                          )}
                        </div>
                      )}

                      {/* حالة 2: خصم من العجلة - السعر الأصلي أخضر مضروب + السعر الجديد أحمر */}
                      {hasWheelDiscount && (
                        <div className="flex flex-col">
                          <span 
                            className="text-3xl md:text-4xl font-black text-red-600"
                            style={{ fontFamily: 'Cairo, sans-serif' }}
                          >
                            {finalPrice} MAD
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600 line-through">
                              {product.price} MAD
                            </span>
                            <span className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full">
                              وفّر {wheelSavings} MAD
                            </span>
                          </div>
                        </div>
                      )}

                      {/* حالة 3: شحن مجاني - السعر بالأخضر */}
                      {hasFreeShipping && (
                        <div className="flex flex-col">
                          <span 
                            className="text-3xl md:text-4xl font-black text-green-600"
                            style={{ fontFamily: 'Cairo, sans-serif' }}
                          >
                            {product.price} MAD
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm font-semibold text-slate-400 line-through">
                              {product.originalPrice} MAD
                            </span>
                          )}
                        </div>
                      )}

                      {/* حالة 4: لم يدور العجلة بعد - السعر العادي */}
                      {!currentOffer && (
                        <div className="flex flex-col">
                          <span 
                            className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                            style={{ fontFamily: 'Cairo, sans-serif' }}
                          >
                            {product.price} MAD
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm font-semibold text-slate-400 line-through">
                              {product.originalPrice} MAD
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* زر الإضافة */}
                    <Button
                      size="lg"
                      className="w-full rounded-2xl text-base font-black text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden group/btn"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        أضف للسلة
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <style>{`
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

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
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

        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Collection;