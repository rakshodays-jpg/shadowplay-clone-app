import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-youtube-overlay/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 90 20" fill="none">
                    <rect width="28" height="20" rx="4" fill="hsl(var(--youtube-red))" />
                    <path d="M11 6L19 10L11 14V6Z" fill="white" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Welcome to ShadowPlay</h2>
                  <p className="text-sm text-muted-foreground">Important Notice</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-4">
              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <p className="text-sm text-foreground leading-relaxed">
                  <strong className="text-primary">ShadowPlay</strong> is an independent application and is{' '}
                  <strong>not affiliated with, endorsed by, or connected to YouTube or Google</strong> in any way.
                </p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  This app uses the official YouTube Data API v3 to provide video content and respects all YouTube Terms of Service.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-2 flex flex-col gap-3">
              <button
                onClick={handleAccept}
                className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors"
              >
                I Understand, Continue
              </button>
              <a
                href="/privacy"
                className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Read our Privacy Policy
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
