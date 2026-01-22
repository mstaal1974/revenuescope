import AuditWidget from "@/components/audit-widget";
import { Header } from "@/components/shared/header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center">
        <AuditWidget />
      </main>
    </div>
  );
}
