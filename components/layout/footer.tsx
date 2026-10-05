import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="space-y-4">
              <Logo />
              <p className="text-muted-foreground mb-6 max-w-md">
                Discover premium products with exceptional quality and modern design. Your
                satisfaction is our priority.
              </p>
            </div>

            {/* Newsletter */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Subscribe to our newsletter
              </h3>
              <div className="flex space-x-2">
                <Input type="email" placeholder="Enter your email" className="flex-1" />
                <Button>Subscribe</Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary text-gray-400 transition-colors">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary text-gray-400 transition-colors">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary text-gray-400 transition-colors">
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary text-muted-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary text-muted-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary text-muted-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-primary text-muted-foreground transition-colors">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary text-muted-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary text-muted-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-primary text-muted-foreground transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 border-t border-gray-200 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} EcommerceKit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
