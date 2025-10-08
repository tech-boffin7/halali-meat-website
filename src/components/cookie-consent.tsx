"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem("cookie-consent", "true");
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-secondary text-secondary-foreground">
      <div className="container mx-auto flex items-center justify-between">
        <p className="text-sm">
          We use cookies to enhance your browsing experience. By continuing to
          visit this site, you agree to our use of cookies.{" "}
          <Link href="/privacy-policy" className="underline">
            Learn more
          </Link>
        </p>
        <Button onClick={() => acceptConsent()}>Accept</Button>
      </div>
    </div>
  );
}
