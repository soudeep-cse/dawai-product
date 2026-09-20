'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

interface CategoryCardProps {
  id: string;
  name: { bn: string; en: string };
  description: { bn: string; en: string };
  icon: string;
}

export default function CategoryCard({ id, name, description, icon }: CategoryCardProps) {
  const { language } = useLanguage();

  return (
    <Link href={`/category?cat=${id}`}>
      <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full cursor-pointer border-2 border-transparent hover:border-primary-mint">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>

          {/* Name */}
          <h3 className="text-lg font-semibold text-primary-navy group-hover:text-primary-teal transition-colors">
            {name[language]}
          </h3>

          {/* Description */}
          <p className="text-sm text-neutral-gray">
            {description[language]}
          </p>

          {/* CTA indicator */}
          <div className="pt-2 flex items-center text-primary-teal text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>{language === 'bn' ? 'দেখুন' : 'Browse'}</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
