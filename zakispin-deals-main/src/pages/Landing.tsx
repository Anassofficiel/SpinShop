import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Play, Gift, Globe, Palette, HeadphonesIcon } from 'lucide-react';
import { Button } from '../components/UI/button';
import { Card, CardContent } from '../components/UI/card';

const Landing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    { icon: Gift, title: t('landing.features.spin'), color: 'text-primary' },
    {
      icon: Globe,
      title: t('landing.features.countries'),
      color: 'text-secondary',
    },
    {
      icon: Palette,
      title: t('landing.features.personalize'),
      color: 'text-accent',
    },
    {
      icon: HeadphonesIcon,
      title: t('landing.features.support'),
      color: 'text-destructive',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-gradient bg-[length:200%_200%]"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fadeIn">
          <div className="mb-8">
            <div className="inline-block animate-bounce">
              <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow-lg mx-auto">
                <span className="text-6xl">🎡</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient animate-popup">
            {t('landing.title')}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-fadeIn">
            {t('landing.subtitle')}
          </p>

          <Button
            onClick={() => navigate('/splash')}
            size="lg"
            className="btn-primary text-xl px-12 py-8 rounded-full shadow-glow-lg hover:scale-105 transition-transform"
          >
            <Play className="w-6 h-6 mr-2" />
            {t('landing.cta')}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="card-hover animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <div
                        className={`w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center ${feature.color}`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
