
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, User, LogIn, Plus, Home, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { FloatingShapes } from "@/components/ui/animated-background";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current auth state on component mount
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      
      if (data.session?.user) {
        // Get user profile info if available
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData) {
          setUsername(profileData.username);
        }
      }
    };
    
    checkUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      
      // Handle sign in and sign out events
      if (event === 'SIGNED_IN' && session) {
        // Get user profile info
        setTimeout(async () => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .single();
            
          if (profileData) {
            setUsername(profileData.username);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setUsername(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Error signing out", {
          description: error.message
        });
        return;
      }
      
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <FloatingShapes />
      <header className="sticky top-0 z-40 glass border-b border-border/40 backdrop-blur-md">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-foreground font-bold text-xl">Elite<span className="text-elitePurple">Minds</span></span>
            </Link>
            <nav className="hidden md:flex ml-8 space-x-6">
              <Link to="/" className="text-foreground/80 hover:text-elitePurple transition-colors duration-200">Home</Link>
              <Link to="/debates" className="text-foreground/80 hover:text-elitePurple transition-colors duration-200">Debates</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search debates..."
                className="glass-input bg-background/50 pl-10 pr-4 py-2 rounded-full text-sm w-64 focus:outline-none focus:ring-1 focus:ring-elitePurple"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground/50" />
            </div>
            
            <ThemeToggle />
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="flex items-center glass-button hover:bg-glass-highlight text-foreground"
                  size="sm"
                  asChild
                >
                  <Link to="/debates/create">
                    <Plus className="h-4 w-4 mr-1" /> 
                    <span className="hidden sm:inline">New Debate</span>
                  </Link>
                </Button>
                <div className="flex items-center space-x-2">
                  <Link to={`/profile/${username}`} className="flex items-center">
                    <div className="h-8 w-8 bg-elitePurple rounded-full flex items-center justify-center text-white">
                      <User className="h-4 w-4" />
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center text-foreground/70 hover:text-elitePurple"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  className="text-foreground/70 hover:text-elitePurple hover:bg-glass-highlight"
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
        <div className="md:hidden border-t border-border/40">
          <div className="flex justify-between px-4 py-2">
            <Link to="/" className="flex flex-col items-center p-2 text-foreground/70 hover:text-elitePurple">
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link to="/debates" className="flex flex-col items-center p-2 text-foreground/70 hover:text-elitePurple">
              <Search className="h-5 w-5" />
              <span className="text-xs mt-1">Explore</span>
            </Link>
            <Link to="/debates/create" className="flex flex-col items-center p-2 text-foreground/70 hover:text-elitePurple">
              <Plus className="h-5 w-5" />
              <span className="text-xs mt-1">Create</span>
            </Link>
            {isLoggedIn ? (
              <Link to={`/profile/${username}`} className="flex flex-col items-center p-2 text-foreground/70 hover:text-elitePurple">
                <User className="h-5 w-5" />
                <span className="text-xs mt-1">Profile</span>
              </Link>
            ) : (
              <Link to="/login" className="flex flex-col items-center p-2 text-foreground/70 hover:text-elitePurple">
                <LogIn className="h-5 w-5" />
                <span className="text-xs mt-1">Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="glass border-t border-border/40 py-6 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-foreground font-bold text-lg">Elite<span className="text-elitePurple">Minds</span></span>
              <p className="text-sm text-foreground/70 mt-1">Where great ideas are debated.</p>
            </div>
            <div className="flex flex-wrap justify-center space-x-4 md:space-x-6">
              <Link to="/terms" className="text-sm text-foreground/70 hover:text-elitePurple">Terms</Link>
              <Link to="/privacy" className="text-sm text-foreground/70 hover:text-elitePurple">Privacy</Link>
              <Link to="/guidelines" className="text-sm text-foreground/70 hover:text-elitePurple">Community Guidelines</Link>
              <Link to="/contact" className="text-sm text-foreground/70 hover:text-elitePurple">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
