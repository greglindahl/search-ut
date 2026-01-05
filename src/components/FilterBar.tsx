import { useState } from "react";
import { ChevronDown, User, Calendar, FileType, Ratio, Users, FolderOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  options: FilterOption[];
}

const filters: FilterConfig[] = [
  {
    id: "creator",
    label: "Creator",
    icon: <User className="w-4 h-4" />,
    options: [
      { label: "All Creators", value: "all" },
      { label: "Creator 1", value: "creator-1" },
      { label: "Creator 2", value: "creator-2" },
    ],
  },
  {
    id: "content-type",
    label: "Type",
    icon: <FileType className="w-4 h-4" />,
    options: [
      { label: "All Types", value: "all" },
      { label: "Images", value: "images" },
      { label: "Videos", value: "videos" },
      { label: "Documents", value: "documents" },
    ],
  },
  {
    id: "people",
    label: "People",
    icon: <Users className="w-4 h-4" />,
    options: [
      { label: "All", value: "all" },
      { label: "Person Name", value: "person-1" },
      { label: "Person Name", value: "person-2" },
    ],
  },
  {
    id: "folders",
    label: "Folders",
    icon: <FolderOpen className="w-4 h-4" />,
    options: [
      { label: "All Folders", value: "all" },
      { label: "Season 2025", value: "season-2025" },
      { label: "Season 2024", value: "season-2024" },
      { label: "Archive", value: "archive" },
    ],
  },
  {
    id: "date-range",
    label: "Date",
    icon: <Calendar className="w-4 h-4" />,
    options: [
      { label: "All Time", value: "all" },
      { label: "Last 7 Days", value: "7d" },
      { label: "Last 30 Days", value: "30d" },
      { label: "Last Year", value: "1y" },
    ],
  },
  {
    id: "aspect-ratio",
    label: "Ratio",
    icon: <Ratio className="w-4 h-4" />,
    options: [
      { label: "All Ratios", value: "all" },
      { label: "1:1", value: "1:1" },
      { label: "16:9", value: "16:9" },
      { label: "4:3", value: "4:3" },
      { label: "9:16", value: "9:16" },
    ],
  },
];

interface FilterBarProps {
  onFilterChange?: (filterId: string, value: string) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, { value: string; label: string }>>({});

  const handleFilterSelect = (filterId: string, value: string, label: string) => {
    if (value === "all") {
      // Remove filter when "All" is selected
      const newFilters = { ...activeFilters };
      delete newFilters[filterId];
      setActiveFilters(newFilters);
    } else {
      setActiveFilters(prev => ({
        ...prev,
        [filterId]: { value, label }
      }));
    }
    onFilterChange?.(filterId, value);
  };

  const handleRemoveFilter = (filterId: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterId];
    setActiveFilters(newFilters);
    onFilterChange?.(filterId, "all");
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    Object.keys(activeFilters).forEach(filterId => {
      onFilterChange?.(filterId, "all");
    });
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {filters.map((filter) => {
        const isActive = activeFilters[filter.id];
        return (
          <DropdownMenu key={filter.id}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="h-8 gap-1.5 px-2.5 text-xs font-medium"
              >
                {filter.icon}
                <span className="hidden sm:inline">
                  {isActive ? activeFilters[filter.id].label : filter.label}
                </span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-popover z-50">
              {filter.options.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleFilterSelect(filter.id, option.value, option.label)}
                  className={activeFilters[filter.id]?.value === option.value ? "bg-accent" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <>
          <div className="h-4 w-px bg-border mx-1" />
          {Object.entries(activeFilters).map(([filterId, { label }]) => {
            const filter = filters.find(f => f.id === filterId);
            return (
              <Badge 
                key={filterId} 
                variant="secondary" 
                className="h-7 gap-1 pl-2 pr-1 text-xs cursor-pointer hover:bg-secondary/80"
              >
                <span className="text-muted-foreground">{filter?.label}:</span>
                <span>{label}</span>
                <button 
                  onClick={() => handleRemoveFilter(filterId)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </>
      )}
    </div>
  );
}
