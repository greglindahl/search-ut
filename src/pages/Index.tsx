import { useState, useCallback, useEffect } from "react";
import { LeftNav, Screen } from "@/components/LeftNav";
import { ContentScreen } from "@/components/ContentScreen";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Index = () => {
  const isMobile = useIsMobile();
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>("home");
  const [history, setHistory] = useState<Screen[]>(["home"]);

  // Close mobile nav when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileNavOpen(false);
    }
  }, [isMobile]);

  const handleToggleNav = useCallback(() => {
    if (isMobile) {
      setIsMobileNavOpen((prev) => !prev);
    } else {
      setIsNavExpanded((prev) => !prev);
    }
  }, [isMobile]);

  const handleNavigate = useCallback((screen: Screen) => {
    setActiveScreen(screen);
    setHistory((prev) => [...prev, screen]);
    // Close mobile nav on navigation
    if (isMobile) {
      setIsMobileNavOpen(false);
    }
  }, [isMobile]);

  const handleBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setActiveScreen(newHistory[newHistory.length - 1]);
    }
  }, [history]);

  const handleCloseMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      {/* Top right icons - fixed */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        {/* Announcements */}
        <button className="p-2 hover:bg-accent rounded-md transition-colors">
          <i className="bi bi-megaphone text-topnav-icon hover:text-topnav-icon-hover text-lg" />
        </button>

        {/* Messages with badge */}
        <button className="relative p-2 hover:bg-accent rounded-md transition-colors">
          <i className="bi bi-envelope text-topnav-icon hover:text-topnav-icon-hover text-lg" />
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            99+
          </span>
        </button>

        {/* Profile avatar */}
        <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
          <AvatarFallback className="bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Mobile header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b flex items-center px-4 z-40">
          <button
            onClick={handleToggleNav}
            className="p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>
      )}

      {/* Mobile backdrop */}
      {isMobile && isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={handleCloseMobileNav}
        />
      )}

      <LeftNav
        isExpanded={isMobile ? true : isNavExpanded}
        activeScreen={activeScreen}
        onToggle={handleToggleNav}
        onNavigate={handleNavigate}
        isMobile={isMobile}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={handleCloseMobileNav}
      />
      <ContentScreen
        screen={activeScreen}
        history={history}
        onBack={handleBack}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Index;
