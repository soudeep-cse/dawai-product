'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              {/* Placeholder for logo - replace with actual logo.png */}
              <div className="w-10 h-10 bg-primary-teal rounded-lg flex items-center justify-center text-white font-bold text-xl">
                দ
              </div>
              <span className={`ml-2 text-xl font-bold text-primary-navy ${language === 'bn' ? 'bengali' : ''}`}>
                {t('site.name')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-neutral-dark hover:text-primary-teal transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/category" className="text-neutral-dark hover:text-primary-teal transition-colors">
              {t('nav.categories')}
            </Link>
            <Link href="/prescription" className="text-neutral-dark hover:text-primary-teal transition-colors">
              {t('nav.prescription')}
            </Link>
          </nav>

          {/* Right side: Language toggle, Account, Cart */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm font-medium text-primary-navy bg-neutral-light rounded-md hover:bg-primary-mint hover:text-white transition-colors"
              aria-label="Toggle language"
            >
              {language === 'bn' ? 'English' : 'বাংলা'}
            </button>

            {/* Account */}
            <Link
              href="/account"
              className="hidden sm:flex items-center text-neutral-dark hover:text-primary-teal transition-colors"
              aria-label={t('nav.account')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center text-neutral-dark hover:text-primary-teal transition-colors"
              aria-label={t('nav.cart')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {/* Cart badge - would show item count in real implementation */}
              <span className="absolute -top-1 -right-1 bg-accent-coral text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-neutral-dark hover:text-primary-teal"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-light">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-neutral-dark hover:text-primary-teal transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/category"
                className="text-neutral-dark hover:text-primary-teal transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.categories')}
              </Link>
              <Link
                href="/prescription"
                className="text-neutral-dark hover:text-primary-teal transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.prescription')}
              </Link>
              <Link
                href="/account"
                className="text-neutral-dark hover:text-primary-teal transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.account')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
