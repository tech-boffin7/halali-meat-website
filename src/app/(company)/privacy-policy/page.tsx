import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-16 sm:py-24 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">Privacy Policy</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">Your privacy is important to us.</p>
        </div>
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p>
            At Halali Meat Ltd, we are committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, and disclose your
            personal information when you visit our website.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We may collect personal information from you, such as your name, email
            address, and phone number, when you fill out a contact form or request
            a quote. We also collect non-personal information, such as your IP
            address and browsing behavior, through the use of cookies.
          </p>

          <h2>Use of Information</h2>
          <p>
            We use the information we collect to respond to your inquiries, provide
            you with a quote, and improve our website and services. We may also
            use your information to send you marketing communications, but you can
            opt out of these at any time.
          </p>

          <h2>Disclosure of Information</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal
            information to outside parties. We may share your information with
            trusted third parties who assist us in operating our website,
            conducting our business, or servicing you, as long as those parties
            agree to keep this information confidential.
          </p>

          <h2>Cookies</h2>
          <p>
            We use cookies to understand and save your preferences for future
            visits and compile aggregate data about site traffic and site
            interaction so that we can offer better site experiences and tools in
            the future.
          </p>

          <h2>Your Consent</h2>
          <p>
            By using our site, you consent to our online privacy policy.
          </p>

          <h2>Changes to our Privacy Policy</h2>
          <p>
            If we decide to change our privacy policy, we will post those changes
            on this page.
          </p>

          <h2>Contacting Us</h2>
          <p>
            If there are any questions regarding this privacy policy, you may
            contact us using the information on our contact page.
          </p>
        </div>
      </div>
    </div>
  );
}
