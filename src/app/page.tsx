import { Header } from "@/components/shared/header";
import { TerminalLoader } from "@/components/landing/terminal-loader";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mb-4 animate-fade-in-up">
            Unlock Hidden Revenue in Your Curriculum.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 [animation-delay:200ms] animate-fade-in-up">
            RevenueScope AI analyzes your RTO's scope to find untapped financial
            opportunities, providing a multi-perspective audit for growth.
          </p>
          <div className="[animation-delay:400ms] animate-fade-in-up">
            <TerminalLoader />
          </div>
        </div>
      </main>
    </div>
  );
}
