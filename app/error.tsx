'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import ButtonPill from '@/components/ui/ButtonPill';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900/40 via-purple-900/50 to-pink-900/40">
      <div className="sparkle-noise absolute inset-0 opacity-20" />
      
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 shadow-glass backdrop-blur-xl">
          {/* Error Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-5xl">
            ⚠️
          </div>

          {/* Error Message */}
          <h1 className="font-serif text-4xl font-bold mb-4">
            Oops! Something Went Wrong
          </h1>
          
          <p className="text-lg text-white/80 mb-8">
            We encountered an unexpected error. Our team has been notified and we're working on it.
          </p>

          {/* Error Details (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-left">
              <p className="text-sm font-mono text-red-300 break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20 border-0 bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-indigo-500/80 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              Try Again
            </button>
            
            <Link href="/">
              <button className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/15 bg-white/5 text-white/85 hover:bg-white/10">
                Go Home
              </button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="mt-8 text-sm text-white/60">
            If this problem persists, please{' '}
            <a 
              href="mailto:support@colorcocktailfactory.com" 
              className="text-purple-300 hover:text-purple-200 underline"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
