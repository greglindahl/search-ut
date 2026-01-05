import { ChevronDown, User, Calendar, FileType, Ratio, Users, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="flex flex-wrap gap-1.5">
      {filters.map((filter) => (
        <DropdownMenu key={filter.id}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 gap-1.5 px-2.5 text-xs font-medium"
            >
              {filter.icon}
              <span className="hidden sm:inline">{filter.label}</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-popover z-50">
            {filter.options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onFilterChange?.(filter.id, option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  );
}
