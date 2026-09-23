'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Medicine } from '@/data/medicines';
import { useState } from 'react';
import Link from 'next/link';

interface MedicineCardProps {
  medicine: Medicine;
  onAddToCart?: (medicine: Medicine, quantity: number) => void;
}

// Icon mapping for different dosage forms
const getDosageFormIcon = (dosageForm: string): string => {
  const formLower = dosageForm.toLowerCase();
  if (formLower.includes('tablet') || formLower.includes('capsule')) return '💊';
  if (formLower.includes('syrup') || formLower.includes('liquid')) return '🧪';
  if (formLower.includes('injection') || formLower.includes('vial')) return '💉';
  if (formLower.includes('inhaler')) return '🌬️';
  if (formLower.includes('insulin')) return '🩸';
  if (formLower.includes('cream') || formLower.includes('ointment') || formLower.includes('gel')) return '🧴';
  if (formLower.includes('diaper') || formLower.includes('wipes')) return '👶';
  if (formLower.includes('pad') || formLower.includes('sanitary')) return '🩸';
  if (formLower.includes('condom')) return '🛡️';
  if (formLower.includes('powder') || formLower.includes('formula')) return '🥛';
  if (formLower.includes('test-kit') || formLower.includes('kit')) return '🧬';
  if (formLower.includes('wash') || formLower.includes('solution')) return '💧';
  return '💊'; // default
};

export default function MedicineCard({ medicine, onAddToCart }: MedicineCardProps) {
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(medicine, quantity);
      // Brief animation feedback
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 600);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
      {/* Image */}
      <Link href={`/medicine/${medicine.id}`}>
        <div className="bg-gradient-to-br from-primary-mint/20 to-primary-teal/20 h-48 flex items-center justify-center cursor-pointer hover:from-primary-mint/30 hover:to-primary-teal/30 transition-all duration-300 overflow-hidden">
          {medicine.image && medicine.image !== '/images/placeholder.jpg' ? (
            <img src={medicine.image} alt={medicine.name[language]} className="w-full h-full object-cover" />
          ) : (
            <div className="text-6xl">{getDosageFormIcon(medicine.dosageForm)}</div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        {/* Name */}
        <Link href={`/medicine/${medicine.id}`}>
          <div className="cursor-pointer">
            <h3 className="font-semibold text-primary-navy line-clamp-2 hover:text-primary-teal transition-colors">
              {medicine.name[language]}
            </h3>
            {medicine.genericName && (
              <p className="text-xs text-neutral-gray mt-1">
                {medicine.genericName[language]}
              </p>
            )}
          </div>
        </Link>

        {/* Dosage and strength */}
        <div className="flex items-center gap-2 text-xs text-neutral-gray">
          <span className="bg-neutral-light px-2 py-1 rounded">
            {medicine.dosageForm}
          </span>
          {medicine.strength && (
            <span className="bg-neutral-light px-2 py-1 rounded">
              {medicine.strength}
            </span>
          )}
        </div>

        {/* Stock status */}
        <div className="flex items-center gap-2">
          {medicine.inStock ? (
            <span className="flex items-center text-xs text-green-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('product.in-stock')}
            </span>
          ) : (
            <span className="flex items-center text-xs text-red-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {t('product.out-of-stock')}
            </span>
          )}
          {medicine.requiresPrescription && (
            <span className="text-xs text-accent-coral">
              Rx
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-neutral-gray">{t('product.per-unit')}</span>
            <span className="text-lg font-bold text-primary-teal">
              ৳{medicine.pricePerUnit.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-neutral-gray">
              {t('product.per-strip')} ({medicine.packSize} {t('product.units')})
            </span>
            <span className="text-sm text-neutral-gray">
              ৳{medicine.pricePerPack}
            </span>
          </div>
        </div>

        {/* Quantity selector and Add to Cart */}
        {medicine.inStock && !medicine.requiresPrescription && (
          <div className="flex items-center gap-2 pt-2">
            {/* Quantity stepper */}
            <div className="flex items-center border border-neutral-light rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-3 py-2 text-primary-teal hover:bg-neutral-light transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border-x border-neutral-light focus:outline-none py-2"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-2 text-primary-teal hover:bg-neutral-light transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 bg-primary-teal hover:bg-primary-mint text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                addedAnimation
                  ? 'bg-green-600 scale-95'
                  : 'hover:shadow-md'
              }`}
            >
              {addedAnimation ? '✓ ' : ''}{t('product.add-to-cart')}
            </button>
          </div>
        )}

        {/* Prescription required message */}
        {medicine.requiresPrescription && (
          <div className="bg-accent-coral/10 border border-accent-coral/30 rounded-lg px-3 py-2">
            <p className="text-xs text-accent-coral text-center">
              {t('product.prescription-required')}
            </p>
          </div>
        )}

        {/* Discreet packaging indicator for sensitive items */}
        {medicine.isSensitive && (
          <div className="flex items-center gap-1 text-xs text-primary-navy bg-primary-navy/5 px-2 py-1 rounded">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>{language === 'bn' ? 'গোপনীয় প্যাকেজিং' : 'Discreet packaging'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
