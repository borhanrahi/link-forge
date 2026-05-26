import Link from "next/link";
import { Button } from "@/components/ui";

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Privacy Policy</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Last updated: May 1, 2026</p>

          <div className="mt-10 space-y-8 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">1. Introduction</h2>
              <p className="mt-2">LinkNest ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our link management platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">2. Information We Collect</h2>
              <p className="mt-2">We collect information that you provide directly to us, including:</p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Account information (name, email address, password)</li>
                <li>Profile information (avatar, bio, social links)</li>
                <li>Content you create (short links, bio pages, QR codes)</li>
                <li>Payment information (processed securely by our payment partners)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">3. How We Use Your Information</h2>
              <p className="mt-2">We use the information we collect to:</p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">4. Data Security</h2>
              <p className="mt-2">We implement appropriate technical and organizational security measures to protect your information. However, no electronic transmission or storage of information can be guaranteed to be 100% secure. We use encryption, access controls, and regular security audits to safeguard your data.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">5. Third-Party Services</h2>
              <p className="mt-2">We may share your information with third-party service providers who perform services on our behalf, such as payment processing, analytics, and email delivery. These providers are contractually obligated to protect your information.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">6. Your Rights</h2>
              <p className="mt-2">Depending on your location, you may have rights regarding your personal information, including:</p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Access to your personal data</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your data</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">7. Contact Us</h2>
              <p className="mt-2">If you have questions about this Privacy Policy, please contact us at <Link href="/contact" className="text-terracotta-500 hover:text-terracotta-600 dark:text-terracotta-400">privacy@linknest.com</Link>.</p>
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
