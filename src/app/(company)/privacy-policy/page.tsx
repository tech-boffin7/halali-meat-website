import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Privacy Policy</h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">Last updated: October 1, 2025</p>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <p>
              At Halali Meat Ltd ("we", "us", or "our"), we are committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your
              personal information when you visit our website, halalimeatltd.com (the "Site").
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Information We Collect</h2>
            <p>
              We may collect personal information from you, such as your name, email
              address, and phone number, when you voluntarily provide it to us by filling out a contact form or requesting
              a quote. We also automatically collect non-personal information, such as your IP
              address and browsing behavior, through the use of cookies and similar technologies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Use of Your Information</h2>
            <p>
              We use the information we collect to respond to your inquiries, provide
              you with quotes, and improve our website and services. We may also
              use your information to send you marketing communications, but you can
              opt out of receiving these at any time by following the unsubscribe link or instructions provided in any email we send.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Disclosure of Information</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to outside parties without your consent. We may, however, share your information with
              trusted third-party service providers who assist us in operating our website,
              conducting our business, or servicing you, so long as those parties
              agree to keep this information confidential.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Cookies and Web Beacons</h2>
            <p>
              We use cookies to understand and save your preferences for future
              visits and compile aggregate data about site traffic and site
              interaction so that we can offer better site experiences and tools in
              the future. You can choose to disable cookies through your browser settings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Your Consent</h2>
            <p>
              By using our site, you consent to our online privacy policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Changes to our Privacy Policy</h2>
            <p>
              If we decide to change our privacy policy, we will post those changes
              on this page and update the "Last updated" date at the top of this policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Contacting Us</h2>
            <p>
              If there are any questions regarding this privacy policy, you may
              contact us using the information on our contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
