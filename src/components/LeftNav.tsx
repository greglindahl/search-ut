import { X } from "lucide-react";
import { NavItem } from "./NavItem";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { OrgSwitcher, MobileOrgSwitcher } from "./OrgSwitcher";

export type Screen =
  | "home"
  | "library"
  | "engage"
  | "requests"
  | "connect"
  | "stats"
  | "admin"
  | "help";

interface LeftNavProps {
  isExpanded: boolean;
  activeScreen: Screen;
  onToggle: () => void;
  onNavigate: (screen: Screen) => void;
  isMobile?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const mainNavItems: {
  id: Screen;
  icon: string;
  label: string;
}[] = [
  { id: "home", icon: "bi-house", label: "Home" },
  { id: "library", icon: "bi-image", label: "Library" },
  { id: "connect", icon: "bi-plug", label: "Connect" },
  { id: "engage", icon: "bi-cloud-arrow-up", label: "Engage" },
  { id: "requests", icon: "bi-camera", label: "Requests" },
  { id: "stats", icon: "bi-bar-chart", label: "Insights" },
  { id: "admin", icon: "bi-shield-lock", label: "Admin" },
];

const bottomNavItems: { id: Screen; icon: string; label: string }[] = [
  { id: "help", icon: "bi-question-circle", label: "Help" },
];

const orgs = [
  { id: "zephyr", name: "Zephyr Inc", initial: "Z" },
  { id: "acme", name: "Acme Corp", initial: "A" },
  { id: "nova", name: "Nova Labs", initial: "N" },
];

export function LeftNav({
  isExpanded,
  activeScreen,
  onToggle,
  onNavigate,
  isMobile = false,
  isMobileOpen = false,
  onCloseMobile,
}: LeftNavProps) {
  const [activeOrg, setActiveOrg] = useState(orgs[0]);

  // Mobile: slide-in drawer behavior
  if (isMobile) {
    return (
      <nav
        className={`fixed top-0 left-0 h-screen w-[280px] bg-nav-background border-r border-nav-border flex flex-col z-50 transition-transform duration-300 ease-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile header with close button */}
        <div className="p-4 border-b border-nav-border flex items-center justify-between">
          <MobileOrgSwitcher
            orgs={orgs}
            activeOrg={activeOrg}
            onOrgChange={setActiveOrg}
          />
          <button
            onClick={onCloseMobile}
            className="p-2 hover:bg-sidebar-accent rounded-md transition-colors text-nav-text hover:text-nav-text-hover"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main navigation */}
        <div className="flex-1 py-2 overflow-y-auto">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isExpanded={true}
              isActive={activeScreen === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-nav-border" />

        {/* Bottom navigation */}
        <div className="py-2">
          {bottomNavItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isExpanded={true}
              isActive={activeScreen === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>
      </nav>
    );
  }

  // Desktop: original behavior
  return (
    <nav
      className="h-screen bg-nav-background border-r border-nav-border flex flex-col nav-transition flex-shrink-0 relative group"
      style={{ width: isExpanded ? "256px" : "72px" }}
    >
      {/* Floating toggle button - appears on right edge on hover */}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            onClick={onToggle}
            className="absolute top-8 -translate-y-1/2 -right-3 z-10 w-6 h-6 bg-nav-background border border-nav-border rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sidebar-accent"
            aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
          >
            <i className="bi bi-layout-sidebar text-nav-text text-xs" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {isExpanded ? "Collapse" : "Expand"}
        </TooltipContent>
      </Tooltip>

      {/* Header with org logo dropdown */}
      <div className={`border-b border-nav-border ${isExpanded ? "p-4" : "p-4 flex justify-center"}`}>
        <OrgSwitcher
          orgs={orgs}
          activeOrg={activeOrg}
          onOrgChange={setActiveOrg}
          isExpanded={isExpanded}
        />
      </div>

      {/* Main navigation */}
      <div className="flex-1 py-2">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isExpanded={isExpanded}
            isActive={activeScreen === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-nav-border" />

      {/* Bottom navigation */}
      <div className="py-2">
        {bottomNavItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isExpanded={isExpanded}
            isActive={activeScreen === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </div>
    </nav>
  );
}