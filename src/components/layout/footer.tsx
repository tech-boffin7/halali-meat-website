'use client';

import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { DynamicLogo } from "../common/dynamic-logo";

interface FooterProps {
  lightLogoUrl?: string | null;
  darkLogoUrl?: string | null;
}

export default function Footer({ lightLogoUrl, darkLogoUrl }: FooterProps = {}) {

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#" },
    { icon: <Twitter size={20} />, href: "#" },
    { icon: <Instagram size={20} />, href: "#" },
  ];

  const footerLinks = [
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/services", label: "Services" },
        { href: "/halal-standards", label: "Halal Standards" },
      ],
    },
    {
      title: "Products",
      links: [
        { href: "/products?category=beef", label: "Beef" },
        { href: "/products?category=lamb", label: "Lamb & Mutton" },
        { href: "/products?category=goat", label: "Goat" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/contact", label: "Contact Us" },
        { href: "/get-a-quote", label: "Get a Quote" },
        { href: "/privacy-policy", label: "Privacy Policy" },
      ],
    },
  ];

  return (
    <footer className="bg-secondary/50 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 text-center md:text-left">
            <Link href="/" className="inline-flex items-center justify-center md:justify-start space-x-2">
              <DynamicLogo 
                lightLogoUrl={lightLogoUrl}
                darkLogoUrl={darkLogoUrl}
                width={120}
                height={50}
              />
            </Link>
            <p className="text-xs text-muted-foreground mx-auto max-w-xs md:mx-0"> {/* Added mx-auto for centering */}
              Premium Halal Meat, Exported with Trust.
            </p>
            <div className="flex mt-4 space-x-4 justify-center md:justify-start"> {/* Centered social links */}
              {socialLinks.map((social, index) => (
                <Link key={index} href={social.href} className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="text-center md:text-left"> {/* Centered section title for mobile */}
              <h3 className="text-sm font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3 flex flex-col items-center md:items-start"> {/* Centered links for mobile */}
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border p-4 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} Halali Meat Ltd. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Designed & Developed by | {" "}
            <a href="https://winterjackson.github.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:bg-primary hover:text-primary-foreground p-2 rounded-[5px] transition-colors duration-300 font-bold hover:scale-105 hover:-translate-y-1">
              K U Z Z I
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}