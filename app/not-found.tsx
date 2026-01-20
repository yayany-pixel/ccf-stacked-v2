import Link from 'next/link';
import ButtonPill from '@/components/ui/ButtonPill';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900/40 via-purple-900/50 to-pink-900/40">
      <div className="sparkle-noise absolute inset-0 opacity-20" />
      
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 shadow-glass backdrop-blur-xl">
          {/* 404 Icon */}
          <div className="mx-auto mb-6 text-8xl">
            🎨
          </div>

          {/* Error Message */}
          <h1 className="font-serif text-6xl font-bold mb-4 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
            404
          </h1>
          
          <h2 className="text-2xl font-bold mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-white/80 mb-8 max-w-md mx-auto">
            Looks like this creative masterpiece doesn't exist yet. Let's get you back on track!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <ButtonPill href="/" variant="primary">
              Go Home
            </ButtonPill>
            
            <ButtonPill href="/activities" variant="secondary">
              Browse Classes
            </ButtonPill>

            <ButtonPill href="/chicago" variant="ghost">
              Chicago Studio
            </ButtonPill>

            <ButtonPill href="/eugene" variant="ghost">
              Eugene Studio
            </ButtonPill>
          </div>

          {/* Popular Links */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-white/60 mb-4">Popular Pages:</p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <Link href="/team-building" className="text-purple-300 hover:text-purple-200 underline underline-offset-4">
                Team Building
              </Link>
              <span className="text-white/30">•</span>
              <Link href="/gift-cards" className="text-purple-300 hover:text-purple-200 underline underline-offset-4">
                Gift Cards
              </Link>
              <span className="text-white/30">•</span>
              <Link href="/private-events" className="text-purple-300 hover:text-purple-200 underline underline-offset-4">
                Private Events
              </Link>
              <span className="text-white/30">•</span>
              <Link href="/blog" className="text-purple-300 hover:text-purple-200 underline underline-offset-4">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
