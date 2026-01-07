import { useState } from "react";
import { ChevronDown, User, Calendar, Image, Ratio, Users, FolderOpen, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
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
  multiSelect?: boolean;
}

const filters: FilterConfig[] = [
  {
    id: "creator",
    label: "Creator",
    icon: <User className="w-4 h-4" />,
    multiSelect: true,
    options: [
      { label: "John Smith", value: "John Smith" },
      { label: "Jane Doe", value: "Jane Doe" },
      { label: "Alex Johnson", value: "Alex Johnson" },
    ],
  },
  {
    id: "content-type",
    label: "Type",
    icon: <Image className="w-4 h-4" />,
    multiSelect: true,
    options: [
      { label: "Image", value: "image" },
      { label: "Video", value: "video" },
    ],
  },
  {
    id: "people",
    label: "People",
    icon: <Users className="w-4 h-4" />,
    multiSelect: true,
    options: [
      { label: "Lebron James", value: "Lebron James" },
      { label: "Steph Curry", value: "Steph Curry" },
      { label: "Kevin Durant", value: "Kevin Durant" },
      { label: "Giannis Antetokounmpo", value: "Giannis Antetokounmpo" },
      { label: "Luka Doncic", value: "Luka Doncic" },
    ],
  },
  {
    id: "folders",
    label: "Folders",
    icon: <FolderOpen className="w-4 h-4" />,
    multiSelect: true,
    options: [
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
      { label: "Today", value: "today" },
      { label: "Last 7 Days", value: "week" },
      { label: "Last 30 Days", value: "month" },
      { label: "Last Year", value: "year" },
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
  onFilterChange?: (filterId: string, values: string[]) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, { value: string; label: string }[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});

  const handleMultiSelect = (filterId: string, value: string, label: string, checked: boolean) => {
    setActiveFilters(prev => {
      const current = prev[filterId] || [];
      let updated: { value: string; label: string }[];
      
      if (checked) {
        updated = [...current, { value, label }];
      } else {
        updated = current.filter(item => item.value !== value);
      }
      
      const newFilters = { ...prev };
      if (updated.length === 0) {
        delete newFilters[filterId];
      } else {
        newFilters[filterId] = updated;
      }
      
      onFilterChange?.(filterId, updated.map(i => i.value));
      return newFilters;
    });
  };

  const handleSingleSelect = (filterId: string, value: string, label: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (value === "all") {
        delete newFilters[filterId];
        onFilterChange?.(filterId, []);
      } else {
        newFilters[filterId] = [{ value, label }];
        onFilterChange?.(filterId, [value]);
      }
      return newFilters;
    });
  };

  const handleRemoveValue = (filterId: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[filterId] || [];
      const updated = current.filter(item => item.value !== value);
      const newFilters = { ...prev };
      if (updated.length === 0) {
        delete newFilters[filterId];
      } else {
        newFilters[filterId] = updated;
      }
      onFilterChange?.(filterId, updated.map(i => i.value));
      return newFilters;
    });
  };

  const clearFilter = (filterId: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      onFilterChange?.(filterId, []);
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    Object.keys(activeFilters).forEach(filterId => {
      onFilterChange?.(filterId, []);
    });
    setActiveFilters({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {filters.map((filter) => {
        const selected = activeFilters[filter.id] || [];
        const isActive = selected.length > 0;
        const isMulti = filter.multiSelect;

        return (
          <DropdownMenu key={filter.id}>
            <DropdownMenuTrigger asChild>
              {isMulti && isActive ? (
                <div className="inline-flex items-center gap-1 h-8 px-1.5 border border-input rounded-md bg-white min-w-[120px] max-w-[280px]">
                  <div className="flex flex-wrap gap-1 flex-1">
                    {selected.map((item) => (
                      <span
                        key={item.value}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-xs"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveValue(filter.id, item.value);
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {item.label}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 ml-auto pl-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFilter(filter.id);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 px-2.5 text-xs font-medium bg-white"
                >
                  {filter.icon}
                  <span className="hidden sm:inline">{filter.label}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-white z-50 min-w-[200px]" onCloseAutoFocus={(e) => e.preventDefault()}>
              {/* Search input */}
              <div className="px-2 py-1.5">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder={`Search ${filter.label.toLowerCase()}...`}
                    value={searchQueries[filter.id] || ""}
                    onChange={(e) => setSearchQueries(prev => ({ ...prev, [filter.id]: e.target.value }))}
                    className="h-7 pl-7 text-xs bg-white"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {filter.options
                  .filter(option => 
                    option.label.toLowerCase().includes((searchQueries[filter.id] || "").toLowerCase())
                  )
                  .map((option) => (
                    isMulti ? (
                      <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={selected.some(s => s.value === option.value)}
                        onCheckedChange={(checked) => 
                          handleMultiSelect(filter.id, option.value, option.label, checked)
                        }
                      >
                        {option.label}
                      </DropdownMenuCheckboxItem>
                    ) : (
                      <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={selected.some(s => s.value === option.value)}
                        onCheckedChange={() => handleSingleSelect(filter.id, option.value, option.label)}
                      >
                        {option.label}
                      </DropdownMenuCheckboxItem>
                    )
                  ))
                }
                {filter.options.filter(option => 
                  option.label.toLowerCase().includes((searchQueries[filter.id] || "").toLowerCase())
                ).length === 0 && (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground text-center">
                    No results found
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
