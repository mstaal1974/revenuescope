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
        <Button asChild>
          <Link href="/">Get Started</Link>
        </Button>
      </div>
    </header>
  );
}
