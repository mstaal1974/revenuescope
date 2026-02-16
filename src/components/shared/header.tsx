'use client';

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="py-4 px-4 md:px-8 absolute top-0 left-0 right-0 z-20 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm font-bold transition-colors ${pathname === '/' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Audits
            </Link>
            <Link 
              href="/admin" 
              className={`text-sm font-bold transition-colors ${pathname === '/admin' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Leads
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
            <Button asChild size="sm" className="bg-slate-950 text-white font-bold hidden sm:flex">
                <Link href="/">Get Free Audit</Link>
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-blue-600 text-white font-black text-xs uppercase">RTO</AvatarFallback>
            </Avatar>
        </div>
      </div>
    </header>
  );
}
