'use client';

import { useState } from 'react';
import { Header } from '@/components/shared/header';
import { LeadsDashboard } from '@/components/admin/LeadsDashboard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound } from 'lucide-react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // In a real application, this should be handled securely on the server.
  const correctPassword = 'Stoolpreston103';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-body">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-200">
            <CardHeader className="text-center p-0 mb-6">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border">
                <KeyRound className="w-8 h-8 text-slate-500" />
              </div>
              <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Admin Access</CardTitle>
              <CardDescription className="text-lg text-slate-500">
                Please enter the password to view the leads dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-xl transition-all text-center"
                  required
                />
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-slate-950 hover:bg-blue-600 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98] text-xl"
                >
                  Unlock Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-body">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <LeadsDashboard />
      </main>
    </div>
  );
}
