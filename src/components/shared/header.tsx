import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
                <Link href="/admin">Admin</Link>
            </Button>
            <Button asChild>
                <a href="/">Get Started</a>
            </Button>
        </div>
      </div>
    </header>
  );
}
