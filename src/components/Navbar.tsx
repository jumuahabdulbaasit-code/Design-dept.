import { useState } from "react";
import { motion } from "motion/react";
import { Palette, Layout, Info, LogOut, User as UserIcon, Plus } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import { auth, signOut } from "@/src/lib/firebase";
import AuthModal from "./AuthModal";
import PostDesignModal from "./PostDesignModal";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const navItems = [
    { name: "Analyze", icon: Palette, href: "#analyze" },
    { name: "Showcase", icon: Layout, href: "#showcase" },
    { name: "About", icon: Info, href: "#about" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handlePostClick = () => {
    if (user) {
      setIsPostModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl tracking-tight">Design dept.</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePostClick}
                className="hidden sm:flex gap-2 rounded-full border-primary/20 hover:border-primary/50"
              >
                <Plus className="w-4 h-4" />
                Post Design
              </Button>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ""} className="w-8 h-8 rounded-full border border-border" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <span className="hidden lg:inline text-sm font-medium">{user.displayName || user.email?.split('@')[0]}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="p-2">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <PostDesignModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />
    </>
  );
}
