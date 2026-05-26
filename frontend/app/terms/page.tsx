import Link from "next/link";
import { Button } from "@/components/ui";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/60 bg-white/80 backdrop-blur-lg dark:border-neutral-800/60 dark:bg-neutral-950/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold tracking-tight text-white transition-transform duration-200 group-hover:scale-105">L</div>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">LinkNest</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-6">
            <Link href="/features" className="hidden sm:inline text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">Features</Link>
            <Link href="/pricing" className="hidden sm:inline text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">Pricing</Link>
            <Link href="/login" className="text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">Sign in</Link>
            <Link href="/register"><Button>Get Started</Button></Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Terms of Service</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Last updated: May 1, 2026</p>

          <div className="mt-10 space-y-8 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">1. Acceptance of Terms</h2>
              <p className="mt-2">By accessing or using LinkNest ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">2. Description of Service</h2>
              <p className="mt-2">LinkNest provides a link management platform that includes URL shortening, bio pages, QR code generation, analytics, and related features. We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">3. User Responsibilities</h2>
              <p className="mt-2">You agree to:</p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Provide accurate account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the Service in compliance with all applicable laws</li>
                <li>Not use the Service for spam, phishing, or malicious purposes</li>
                <li>Not attempt to circumvent any usage limits or restrictions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">4. Account Termination</h2>
              <p className="mt-2">We reserve the right to suspend or terminate accounts that violate these terms, engage in prohibited activities, or for any other reason at our discretion. You may cancel your account at any time from your account settings.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">5. Limitation of Liability</h2>
              <p className="mt-2">LinkNest shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service. Our total liability for any claims under these terms shall not exceed the amount you have paid us in the past 12 months.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">6. Changes to Terms</h2>
              <p className="mt-2">We may update these terms from time to time. We will notify you of material changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">7. Contact</h2>
              <p className="mt-2">For questions about these terms, please contact us at <Link href="/contact" className="text-terracotta-500 hover:text-terracotta-600 dark:text-terracotta-400">legal@linknest.com</Link>.</p>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5"><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold tracking-tight text-white">L</div><span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">LinkNest</span></div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Home</Link>
              <Link href="/features" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Features</Link>
              <Link href="/pricing" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Pricing</Link>
              <Link href="/login" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Sign in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
