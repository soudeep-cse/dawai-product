'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-mint">{t('site.name')}</h3>
            <p className="text-sm text-gray-300">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('nav.categories')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category?cat=prescription" className="text-gray-300 hover:text-primary-mint transition-colors">
                  {t('category.prescription')}
                </Link>
              </li>
              <li>
                <Link href="/category?cat=daily-otc" className="text-gray-300 hover:text-primary-mint transition-colors">
                  {t('category.daily-otc')}
                </Link>
              </li>
              <li>
                <Link href="/category?cat=chronic" className="text-gray-300 hover:text-primary-mint transition-colors">
                  {t('category.chronic')}
                </Link>
              </li>
              <li>
                <Link href="/category?cat=baby-mom" className="text-gray-300 hover:text-primary-mint transition-colors">
                  {t('category.baby-mom')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>{t('footer.about')}</li>
              <li>{t('footer.delivery')}</li>
              <li>{t('footer.terms')}</li>
              <li>{t('footer.privacy')}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📞 +880 1700-000000</p>
              <p>📧 info@dawai.com.bd</p>
              <p>📍 Gazipur - Mymensingh</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
