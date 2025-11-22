import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import Header from '../components/Header/Header';
import CountdownTimer from '../components/UI/CountdownTimer';
import { Button } from '../components/UI/button';
import { Card, CardContent } from '../components/UI/card';
import { Input } from '../components/UI/input';
import { useCart } from '../context/CartContext';
import { useOffer } from '../context/OfferContext';
import { formatPrice, calculateTotal } from '../utils/priceUtils';

const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { currentOffer, timeRemaining, getDiscount, hasFreeShipping } =
    useOffer();

  const discount = getDiscount();
  const freeShipping = hasFreeShipping();
  const totals = calculateTotal(cartItems, discount, freeShipping);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">{t('cart.empty')}</h2>
            <Button
              onClick={() => navigate('/store')}
              size="lg"
              className="btn-primary"
            >
              {t('cart.shopNow')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gradient">
            {t('cart.title')}
          </h1>
          {currentOffer && <CountdownTimer timeRemaining={timeRemaining} />}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <Card key={`${item.id}-${index}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image || 'https://via.placeholder.com/200'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      {item.customization?.name && (
                        <p className="text-sm text-muted-foreground">
                          {item.customization.name} {item.customization.number}
                        </p>
                      )}
                      <p className="text-lg font-bold text-primary mt-2">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeFromCart(item.id, item.customization)
                        }
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.id,
                            parseInt(e.target.value),
                            item.customization
                          )
                        }
                        className="w-20 text-center"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">{t('cart.title')}</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t('cart.subtotal')}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(totals.subtotal)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        {t('cart.discount')} (-{discount}%)
                      </span>
                      <span>-{formatPrice(totals.discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t('cart.shipping')}
                    </span>
                    <span
                      className={
                        freeShipping ? 'text-green-600 font-semibold' : ''
                      }
                    >
                      {freeShipping
                        ? t('cart.free')
                        : formatPrice(totals.shipping)}
                    </span>
                  </div>

                  <div className="h-px bg-border my-4" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('cart.total')}</span>
                    <span className="text-primary">
                      {formatPrice(totals.total)}
                    </span>
                  </div>
                </div>

                {currentOffer && (
                  <div className="mb-4 p-3 bg-accent/10 rounded-lg border border-accent">
                    <p className="text-sm font-medium text-accent text-center">
                      {t('cart.activeOffer')}
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => navigate('/checkout')}
                  size="lg"
                  className="w-full btn-primary"
                >
                  {t('cart.checkout')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
