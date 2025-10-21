import { type ReactNode } from "react";
import { type UserAccount } from "../api/auth";
import Header from "../components/Header";

interface AppLayoutProps {
  user: UserAccount;
  children: ReactNode;
  onLogout?: () => void;
}

function AppLayout({ user, children, onLogout }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="relative z-10">
        <Header user={user} onLogout={onLogout} />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
