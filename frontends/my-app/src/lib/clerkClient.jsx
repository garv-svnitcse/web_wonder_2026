import React from 'react';
import * as ClerkReact from '@clerk/clerk-react';

const rawKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim() || '';
export const isClerkEnabled = Boolean(
  rawKey &&
  rawKey.startsWith('pk_') &&
  rawKey.length > 30 &&
  !rawKey.includes('YOUR_REAL_PUBLISHABLE_KEY_HERE') &&
  !rawKey.includes('0123456789abcdefghijklmnopqrstuv')
);

export const PUBLISHABLE_KEY = rawKey;

export function ClerkProvider({ children }) {
  if (isClerkEnabled) {
    return <ClerkReact.ClerkProvider publishableKey={PUBLISHABLE_KEY}>{children}</ClerkReact.ClerkProvider>;
  }
  return <>{children}</>;
}

export function useAuth() {
  if (isClerkEnabled) {
    return ClerkReact.useAuth();
  }

  return {
    getToken: async () => null,
    isSignedIn: false,
    isLoaded: true,
  };
}

export function useClerk() {
  if (isClerkEnabled) {
    return ClerkReact.useClerk();
  }

  return {
    signOut: async () => {},
  };
}

export function useSignIn() {
  if (isClerkEnabled) {
    return ClerkReact.useSignIn();
  }

  return {
    isLoaded: true,
    signIn: {
      create: async () => ({ status: 'complete', createdSessionId: null }),
      authenticateWithRedirect: async () => {},
      supportedFirstFactors: [],
      attemptFirstFactor: async () => ({ status: 'complete' }),
      prepareFirstFactor: async () => {},
    },
    setActive: async () => {},
  };
}

export function useSignUp() {
  if (isClerkEnabled) {
    return ClerkReact.useSignUp();
  }

  return {
    isLoaded: true,
    signUp: {
      create: async () => ({}),
      prepareEmailAddressVerification: async () => {},
      authenticateWithRedirect: async () => {},
      attemptEmailAddressVerification: async () => ({ status: 'complete' }),
    },
    setActive: async () => {},
  };
}

export function AuthenticateWithRedirectCallback() {
  if (isClerkEnabled) {
    return <ClerkReact.AuthenticateWithRedirectCallback />;
  }
  return null;
}
