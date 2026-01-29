import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8 absolute top-0 left-0 right-0 z-20">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-primary hover:text-primary hover:bg-black/5">
                <Link href="/admin">Admin</Link>
            </Button>
            <Button asChild className="bg-white/50 backdrop-blur-md border border-white/20 text-primary hover:bg-white/80 shadow-md font-bold">
                <a href="/">Get Started</a>
            </Button>
        </div>
      </div>
    </header>
  );
}
