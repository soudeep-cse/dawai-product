'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  medicineId: string;
  medicineName: string;
  medicineNameBn: string;
  quantity: number;
  pricePerUnit: number;
  originalPrice: number;
  hasDiscount: boolean;
  discountType?: string;
  discountValue?: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  isHydrated: boolean;
  addItem: (item: CartItem) => void;
  updateItem: (medicineId: string, quantity: number) => void;
  removeItem: (medicineId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getDiscountAmount: () => number;
  getSubtotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dawai_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to load cart:', err);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('dawai_cart', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.medicineId === newItem.medicineId);

      if (existingItem) {
        return prevItems.map((item) =>
          item.medicineId === newItem.medicineId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }

      return [...prevItems, newItem];
    });
  };

  const updateItem = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(medicineId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.medicineId === medicineId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (medicineId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.medicineId !== medicineId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => {
      const itemPrice = item.pricePerUnit * item.quantity;
      return sum + itemPrice;
    }, 0);
  };

  // pricePerUnit is already the final (post-discount) sale price set by the
  // admin - this is only for the "you saved X" display, not for computing
  // the charged total (that's just getSubtotal()).
  const getDiscountAmount = () => {
    return items.reduce((sum, item) => {
      if (!item.hasDiscount) return sum;
      const perUnitSavings = Math.max(item.originalPrice - item.pricePerUnit, 0);
      return sum + perUnitSavings * item.quantity;
    }, 0);
  };

  const getTotal = () => {
    return getSubtotal();
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isHydrated,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        getTotal,
        getDiscountAmount,
        getSubtotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
