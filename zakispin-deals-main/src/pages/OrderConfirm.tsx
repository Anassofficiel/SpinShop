import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '../components/Header/Header';
import { Button } from '../components/UI/button';
import { Card, CardContent } from '../components/UI/card';

const OrderConfirm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = (location.state as any)?.orderNumber || 'XXXXXXXXX';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center animate-popup">
          <CardContent className="p-12">
            <div className="mb-6">
              <CheckCircle className="w-24 h-24 mx-auto text-green-500 animate-bounce" />
            </div>

            <h1 className="text-3xl font-bold text-gradient mb-4">
              {t('orderConfirm.title')}
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              {t('orderConfirm.message')}
            </p>

            <div className="bg-muted p-6 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                {t('orderConfirm.orderNumber')}
              </p>
              <p className="text-2xl font-bold font-mono">{orderNumber}</p>
            </div>

            <p className="text-muted-foreground mb-8">
              {t('orderConfirm.email')}
            </p>

            <Button
              onClick={() => navigate('/store')}
              size="lg"
              className="btn-primary"
            >
              {t('orderConfirm.backToStore')}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrderConfirm;
