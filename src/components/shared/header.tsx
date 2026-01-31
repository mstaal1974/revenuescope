import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8 absolute top-0 left-0 right-0 z-20">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
            <Button asChild>
                <Link href="/">Get Free Audit</Link>
            </Button>
            <Avatar className="h-9 w-9 hidden sm:flex">
              <AvatarFallback className="bg-primary/20 text-primary font-bold">U</AvatarFallback>
            </Avatar>
        </div>
      </div>
    </header>
  );
}
