import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '../UI/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../UI/dropdown-menu';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
  };

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-3"
        >
          {/* العلم الحالي */}
          <span className="text-lg">{currentLanguage.flag}</span>

          {/* أيقونة الكرة الأرضية */}
          <Globe className="w-4 h-4 text-slate-700" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-40 bg-white shadow-lg rounded-xl p-1"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex items-center gap-3 py-2 cursor-pointer rounded-lg hover:bg-slate-100"
          >
            {/* علم اللغة */}
            <span className="text-lg">{lang.flag}</span>

            {/* الاسم */}
            <span className="flex-1 text-sm">{lang.label}</span>

            {/* صح للغة الحالية */}
            {i18n.language === lang.code && (
              <span className="text-green-600 font-bold text-sm">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
