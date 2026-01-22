import { Target } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Target className="size-8 text-primary" />
      <span className="text-xl font-bold tracking-tight text-foreground font-headline">
        RevenueScope AI
      </span>
    </div>
  );
}
