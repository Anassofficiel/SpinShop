import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Clock } from 'lucide-react';
import Header from '../components/Header/Header';
import { Button } from '../components/UI/button';
import { Input } from '../components/UI/input';
import { Label } from '../components/UI/label';
import { Textarea } from '../components/UI/textarea';
import { Card, CardContent } from '../components/UI/card';
import { toast } from 'sonner';

const Support = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('common.success'));
    setFormData({ email: '', message: '' });
  };

  const contactInfo = [
    { icon: Mail, label: t('support.email'), value: 'support@spinshop.com' },
    { icon: Phone, label: t('support.phone'), value: '+212 6 00 00 00 00' },
    { icon: Clock, label: t('support.hours'), value: t('support.hoursValue') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            {t('support.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('support.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="card-hover">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {info.label}
                      </p>
                      <p className="font-semibold">{info.value}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {t('support.contact')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">{t('support.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t('support.message')}</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full btn-primary" size="lg">
                  {t('support.send')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Support;
