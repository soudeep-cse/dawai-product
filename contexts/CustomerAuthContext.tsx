'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CustomerData {
  id: string;
  phone: string | null;
  email?: string | null;
  name?: string;
  defaultAddress?: string;
  defaultZoneId?: string;
}

interface CustomerAuthContextType {
  customer: CustomerData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (idToken: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<CustomerData>) => Promise<boolean>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if already logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/customers/profile');
      const result = await response.json();

      if (result.success && result.data) {
        setCustomer({
          id: result.data.id,
          phone: result.data.phone,
          email: result.data.email,
          name: result.data.name,
          defaultAddress: result.data.defaultAddress,
          defaultZoneId: result.data.defaultZoneId,
        });
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (idToken: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/firebase-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success && result.data) {
        setCustomer({
          id: result.data.customerId,
          phone: result.data.phone,
          email: result.data.email,
          name: result.data.name,
        });
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCustomer(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfile = async (data: Partial<CustomerData>): Promise<boolean> => {
    try {
      const response = await fetch('/api/customers/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setCustomer((prev) => (prev ? { ...prev, ...data } : null));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Update profile error:', err);
      return false;
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
}
