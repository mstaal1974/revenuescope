import Link from 'next/link';
import { Logo } from './logo';
import { Button } from '../ui/button';
import { Github, Twitter } from 'lucide-react';

export function Footer() {
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Audit Tool', href: '#' },
        { label: 'Genrify Engine', href: '#' },
        { label: 'Integrations', href: '#' },
        { label: 'Pricing', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'History', href: '#' },
        { label: 'Teams', href: '#' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'Contact Us', href: '#' },
        { label: 'Support', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Logo />
            <p className="text-muted-foreground text-base">
              Unlocking education for a more profitable and student-centric future.
            </p>
            <div className="flex space-x-6">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <span className="sr-only">GitHub</span>
                    <Github className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <span className="sr-only">Twitter</span>
                    <Twitter className="h-6 w-6" />
                </Link>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Product</h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks[0].links.map((item) => (
                     <li key={item.label}>
                       <Link href={item.href} className="text-base text-muted-foreground hover:text-foreground">
                         {item.label}
                       </Link>
                     </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks[1].links.map((item) => (
                     <li key={item.label}>
                       <Link href={item.href} className="text-base text-muted-foreground hover:text-foreground">
                         {item.label}
                       </Link>
                     </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Connect</h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks[2].links.map((item) => (
                     <li key={item.label}>
                       <Link href={item.href} className="text-base text-muted-foreground hover:text-foreground">
                         {item.label}
                       </Link>
                     </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-base text-muted-foreground xl:text-center">&copy; 2026 ScopeStack.AI, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
