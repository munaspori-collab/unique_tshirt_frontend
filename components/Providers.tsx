'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/lib/auth-context';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function Providers({ children }: { children: React.ReactNode }) {
  // Only wrap with GoogleOAuthProvider if client ID is provided and valid
  if (googleClientId && googleClientId.length > 0) {
    try {
      return (
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      );
    } catch (error) {
      console.error('GoogleOAuthProvider initialization failed:', error);
      // Fallback to AuthProvider only
      return (
        <AuthProvider>
          {children}
        </AuthProvider>
      );
    }
  }

  // Without Google OAuth, just use AuthProvider
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
