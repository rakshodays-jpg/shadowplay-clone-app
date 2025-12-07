import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-youtube-divider safe-top">
        <div className="flex items-center h-14 px-4 gap-4">
          <Link to="/settings" className="p-2 -ml-2 rounded-full hover:bg-youtube-hover transition-colors">
            <ChevronLeft className="w-6 h-6 text-youtube-icon" />
          </Link>
          <h1 className="text-lg font-medium text-foreground">Privacy Policy</h1>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3">Privacy Policy for ShadowPlay</h2>
            <p className="text-sm text-muted-foreground">Last updated: December 2024</p>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">1. Introduction</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ShadowPlay ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your information 
              when you use our mobile application.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">2. Information We Collect</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              We may collect the following types of information:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>Search queries and viewing history within the app</li>
              <li>Device information (device type, operating system)</li>
              <li>App usage data and preferences</li>
              <li>Theme and appearance settings</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">3. How We Use Your Information</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              We use the collected information to:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>Provide and improve our services</li>
              <li>Personalize your experience</li>
              <li>Remember your preferences</li>
              <li>Analyze app usage patterns</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">4. Third-Party Services</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ShadowPlay uses the YouTube Data API v3 to provide video content. 
              When using our app, you are also subject to Google's Privacy Policy. 
              We do not store your YouTube account credentials or personal YouTube data.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">5. Data Storage</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your preferences and settings are stored locally on your device. 
              We do not transfer or store personal data on external servers.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">6. Children's Privacy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our app is not intended for children under 13 years of age. 
              We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">7. Changes to This Policy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. 
              We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">8. Disclaimer</h3>
            <div className="p-4 bg-muted rounded-xl">
              <p className="text-sm text-foreground leading-relaxed font-medium">
                ShadowPlay is not affiliated with, endorsed by, or connected to YouTube, Google, 
                or any of their subsidiaries or affiliates. YouTube and the YouTube logo are 
                trademarks of Google LLC. This application uses the official YouTube Data API v3 
                in compliance with YouTube's Terms of Service.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">9. Contact Us</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:support@shadowplay.app" className="text-primary hover:underline">
                support@shadowplay.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
