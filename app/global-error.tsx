'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to external service if configured
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        backgroundColor: '#080A10',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          maxWidth: '600px', 
          padding: '2rem', 
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ 
            fontSize: '2rem', 
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            Critical Error
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            marginBottom: '2rem',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            We're sorry, but something went critically wrong. Please try refreshing the page.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#fff',
                background: 'linear-gradient(to right, #a855f7, #ec4899)',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Try Again
            </button>
            
            <a
              href="/"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.85)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '9999px',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              Go Home
            </a>
          </div>

          <p style={{ 
            marginTop: '2rem', 
            fontSize: '0.875rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            Need help?{' '}
            <a 
              href="mailto:support@colorcocktailfactory.com"
              style={{ color: '#a78bfa', textDecoration: 'underline' }}
            >
              Contact Support
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
