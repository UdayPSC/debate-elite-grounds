
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, User, LogIn, Plus, Home } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // In a real app, we would use authentication context
  const isLoggedIn = false;

  return (
    <div className="flex flex-col min-h-screen bg-eliteGray">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-eliteNavy font-bold text-xl">Elite<span className="text-elitePurple">Minds</span></span>
            </Link>
            <nav className="hidden md:flex ml-8 space-x-6">
              <Link to="/" className="text-eliteDarkGray hover:text-elitePurple transition-colors">Home</Link>
              <Link to="/debates" className="text-eliteDarkGray hover:text-elitePurple transition-colors">Debates</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search debates..."
                className="bg-eliteGray pl-10 pr-4 py-2 rounded-lg text-sm w-64 focus:outline-none focus:ring-1 focus:ring-elitePurple"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-eliteMediumGray" />
            </div>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="flex items-center bg-white border-elitePurple text-elitePurple hover:bg-eliteLightPurple"
                  size="sm"
                  asChild
                >
                  <Link to="/debates/create">
                    <Plus className="h-4 w-4 mr-1" /> 
                    <span className="hidden sm:inline">New Debate</span>
                  </Link>
                </Button>
                <Link to="/profile">
                  <div className="h-8 w-8 bg-elitePurple rounded-full flex items-center justify-center text-white">
                    <User className="h-4 w-4" />
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  className="text-eliteDarkGray hover:text-elitePurple hover:bg-eliteLightPurple"
                  size="sm"
                  asChild
                >
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-1" />
                    Log in
                  </Link>
                </Button>
                <Button
                  className="bg-elitePurple hover:bg-elitePurple/90 text-white"
                  size="sm"
                  asChild
                >
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex justify-between px-4 py-2">
            <Link to="/" className="flex flex-col items-center p-2 text-eliteDarkGray">
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link to="/debates" className="flex flex-col items-center p-2 text-eliteDarkGray">
              <Search className="h-5 w-5" />
              <span className="text-xs mt-1">Explore</span>
            </Link>
            <Link to="/debates/create" className="flex flex-col items-center p-2 text-eliteDarkGray">
              <Plus className="h-5 w-5" />
              <span className="text-xs mt-1">Create</span>
            </Link>
            <Link to="/login" className="flex flex-col items-center p-2 text-eliteDarkGray">
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-eliteNavy font-bold text-lg">Elite<span className="text-elitePurple">Minds</span></span>
              <p className="text-sm text-eliteMediumGray mt-1">Where great ideas are debated.</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-sm text-eliteMediumGray hover:text-elitePurple">Terms</Link>
              <Link to="/privacy" className="text-sm text-eliteMediumGray hover:text-elitePurple">Privacy</Link>
              <Link to="/guidelines" className="text-sm text-eliteMediumGray hover:text-elitePurple">Community Guidelines</Link>
              <Link to="/contact" className="text-sm text-eliteMediumGray hover:text-elitePurple">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
