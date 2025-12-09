import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ExternalLink } from 'lucide-react';

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('shadowplay-disclaimer-seen');
    if (!hasSeenDisclaimer) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('shadowplay-disclaimer-seen', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-sp-overlay/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden border border-primary/20"
          >
            {/* Header */}
            <div className="relative p-6 pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                  {/* ShadowPlay Logo */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sp-surface to-background border border-primary/30 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                      <path 
                        d="M8 5.5v13l11-6.5L8 5.5z" 
                        fill="url(#disclaimerGradient)"
                      />
                      <defs>
                        <linearGradient id="disclaimerGradient" x1="8" y1="5.5" x2="19" y2="12">
                          <stop offset="0%" stopColor="hsl(var(--foreground))" />
                          <stop offset="100%" stopColor="hsl(var(--primary))" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Welcome to <span className="text-primary">ShadowPlay</span>
                  </h2>
                  <p className="text-sm text-muted-foreground">Important Notice</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-4">
              <div className="p-4 bg-sp-surface rounded-2xl border border-primary/10">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-foreground leading-relaxed font-medium">
                      ShadowPlay is an independent application and is{' '}
                      <strong className="text-primary">NOT affiliated with, endorsed by, or connected to YouTube or Google</strong>{' '}
                      in any way.
                    </p>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      This app uses the official YouTube Data API v3 to provide video content and respects all YouTube Terms of Service.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-2 flex flex-col gap-3">
              <button
                onClick={handleAccept}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-all glow-primary"
              >
                I Understand, Continue
              </button>
              <a
                href="/privacy"
                className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Read our Privacy Policy
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
