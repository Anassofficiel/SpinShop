import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/UI/button';
import { Input } from '../components/UI/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/UI/card';

import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // إذا كان المستخدم مسجّل أصلاً، ندّيوه مباشرة للـ Home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (error) {
      const msg = error.message.toLowerCase();

      if (msg.includes('email not confirmed')) {
        setErrorMessage(
          'يجب تأكيد بريدك الإلكتروني قبل تسجيل الدخول. تفقد بريدك الوارد.'
        );
      } else {
        setErrorMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      }
      return;
    }

    // تسجيل الدخول نجح عبر Supabase
    const userEmail =
      data.session?.user?.email && data.session.user.email.length > 0
        ? data.session.user.email
        : form.email;

    // نحدّث AuthContext باش يبان الحرف فالهيدر ويبقى داخل حتى يدير Logout
    login({ email: userEmail });

    navigate('/home');
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });

    if (error) {
      setErrorMessage('حدث خطأ أثناء تسجيل الدخول باستخدام Google.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 via-sky-400 to-teal-400 px-4 py-10">
      <div className="relative w-full max-w-md">
        {/* زخارف خلفية */}
        <div className="pointer-events-none absolute -top-10 -left-8 h-32 w-32 rounded-full bg-white/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-10 h-40 w-40 rounded-full bg-cyan-300/35 blur-3xl" />

        <Card className="relative bg-white/95 backdrop-blur-xl shadow-[0_18px_70px_rgba(15,23,42,0.35)] border border-white/70 rounded-[32px] overflow-hidden">
          {/* شريط علوي صغير ديكور */}
          <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500" />

          <CardHeader className="text-center space-y-3 pt-6 pb-3">
            {/* شعار Spin S بدل 👤 */}
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg border border-white/70">
              <span className="text-4xl font-extrabold text-white drop-shadow-md">
                S
              </span>
            </div>

            <CardTitle className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              تسجيل الدخول / Connexion
            </CardTitle>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              ادخل معلومات حسابك للمتابعة إلى{' '}
              <span className="font-semibold text-sky-600">SpinShop</span>{' '}
              <span className="block text-xs md:text-sm text-slate-500">
                Entrez vos informations pour accéder à votre compte.
              </span>
            </p>
          </CardHeader>

          <CardContent className="pb-7 pt-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* البريد الإلكتروني */}
              <div className="space-y-2">
                <label className="block text-base font-semibold text-slate-800 text-right">
                  البريد الإلكتروني / Email
                </label>

                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="h-14 pr-14 bg-slate-50/80 border-slate-200 rounded-3xl text-lg text-right placeholder:text-slate-400 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition-all"
                    placeholder="example@email.com"
                  />
                  <span className="absolute inset-y-0 left-4 flex items-center text-2xl">
                    📩
                  </span>
                </div>
              </div>

              {/* كلمة المرور */}
              <div className="space-y-2">
                <label className="block text-base font-semibold text-slate-800 text-right">
                  كلمة المرور / Mot de passe
                </label>

                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="h-14 pr-14 bg-slate-50/80 border-slate-200 rounded-3xl text-lg text-right placeholder:text-slate-400 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition-all"
                    placeholder="••••••••"
                  />

                  {/* أيقونة العين */}
                  <span
                    className="absolute inset-y-0 left-4 flex items-center text-2xl cursor-pointer select-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Afficher le mot de passe"
                  >
                    {showPassword ? '✅' : '👁️'}
                  </span>
                </div>
              </div>

              {/* رسالة الخطأ */}
              {errorMessage && (
                <p className="text-red-600 text-center text-sm md:text-base -mt-1 bg-red-50 border border-red-100 px-3 py-2 rounded-2xl">
                  {errorMessage}
                </p>
              )}

              {/* زر تسجيل الدخول */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-1 h-12 rounded-3xl text-lg font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? 'جارِ تسجيل الدخول...' : 'تسجيل الدخول / Connexion'}
              </Button>

              {/* Google Login */}
              <Button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-11 rounded-3xl bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 transition-transform hover:scale-[1.02] font-semibold flex items-center justify-center gap-3 border-0 shadow-sm text-base"
              >
                <span className="bg-white text-red-600 w-7 h-7 rounded-full flex items-center justify-center font-bold">
                  G
                </span>
                Se connecter avec Google
              </Button>
            </form>

            {/* رابط إنشاء حساب */}
            <p className="mt-5 text-center text-sm md:text-base text-slate-600">
              ليس لديك حساب؟{' '}
              <Link
                to="/register"
                className="text-sky-700 font-semibold hover:underline"
              >
                إنشاء حساب جديد / Créer un compte
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
