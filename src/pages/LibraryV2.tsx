import { useState, useCallback, useEffect } from "react";
import { LeftNav, Screen } from "@/components/LeftNav";
import { LibraryScreen } from "@/components/LibraryScreen";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";

const LibraryV2 = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
    if (screen === "library") {
      // Stay on current variation
      return;
    }
    // Navigate to main app for other screens
    navigate("/");
  }, [navigate]);

  const handleCloseMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      {/* Variation Switcher */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-card border rounded-lg px-3 py-1.5">
        <span className="text-sm text-muted-foreground">Search Variation:</span>
        <div className="flex items-center gap-1">
          <Link to="/library/v1">
            <span className="text-xs font-medium px-2 py-0.5 rounded hover:bg-accent transition-colors cursor-pointer">V1</span>
          </Link>
          <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded">V2</span>
          <Link to="/library/v3">
            <span className="text-xs font-medium px-2 py-0.5 rounded hover:bg-accent transition-colors cursor-pointer">V3</span>
          </Link>
        </div>
      </div>

      {/* Top right icons */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        <button className="p-2 hover:bg-accent rounded-md transition-colors">
          <i className="bi bi-megaphone text-topnav-icon hover:text-topnav-icon-hover text-lg" />
        </button>
        <button className="relative p-2 hover:bg-accent rounded-md transition-colors">
          <i className="bi bi-envelope text-topnav-icon hover:text-topnav-icon-hover text-lg" />
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            99+
          </span>
        </button>
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
        activeScreen="library"
        onToggle={handleToggleNav}
        onNavigate={handleNavigate}
        isMobile={isMobile}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={handleCloseMobileNav}
      />
      <LibraryScreen isMobile={isMobile} />
    </div>
  );
};

export default LibraryV2;
