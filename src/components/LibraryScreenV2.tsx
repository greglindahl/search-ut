import { useState } from "react";
import { ChevronLeft, ChevronRight, Folder, ChevronDown, Plus, Upload, Grid3X3, List, CheckSquare, Image, Images, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FacetedSearch } from "@/components/FacetedSearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Asset {
  id: string;
  name: string;
  creator: string;
  timeAgo: string;
}

const mockAssets: Asset[] = [
  { id: "1", name: "[Asset Name].png", creator: "[Creator]", timeAgo: "10 min ago" },
  { id: "2", name: "[Asset Name].png", creator: "[Creator]", timeAgo: "20 min ago" },
  { id: "3", name: "[Asset Name].png", creator: "[Creator]", timeAgo: "30 min ago" },
  { id: "4", name: "[Asset Name].png", creator: "[Creator]", timeAgo: "1 hour ago" },
  { id: "5", name: "[Asset Name].png", creator: "[Creator]", timeAgo: "1 hour ago" },
  { id: "6", name: "[Asset Name].png", creator: "[Creator]", timeAgo: "10 min ago" },
  { id: "7", name: "[Asset Name].png", creator: "[Creator]", timeAgo: "20 min ago" },
  { id: "8", name: "[Asset Name].png", creator: "[Creator]", timeAgo: "30 min ago" },
  { id: "9", name: "[Asset Name].png", creator: "[Creator]", timeAgo: "1 hour ago" },
  { id: "10", name: "[Asset Name].png", creator: "[Creator]", timeAgo: "1 hour ago" },
];

interface Gallery {
  id: string;
  name: string;
  assetCount: number;
  timeAgo: string;
}

const mockGalleries: Gallery[] = [
  { id: "1", name: "Gallery 1", assetCount: 29, timeAgo: "2 days ago" },
  { id: "2", name: "Gallery 2", assetCount: 30, timeAgo: "5 days ago" },
  { id: "3", name: "Gallery 3", assetCount: 53, timeAgo: "1 week ago" },
  { id: "4", name: "Gallery 4", assetCount: 20, timeAgo: "2 weeks ago" },
  { id: "5", name: "Gallery 5", assetCount: 45, timeAgo: "3 weeks ago" },
  { id: "6", name: "Gallery 6", assetCount: 12, timeAgo: "1 month ago" },
];

interface FolderCard {
  id: string;
  name: string;
  galleryCount: number;
  timeAgo: string;
}

const mockFolderCards: FolderCard[] = [
  { id: "1", name: "Folder 1", galleryCount: 20, timeAgo: "1 day ago" },
  { id: "2", name: "Folder 2", galleryCount: 8, timeAgo: "3 days ago" },
  { id: "3", name: "Folder 3", galleryCount: 6, timeAgo: "1 week ago" },
  { id: "4", name: "Folder 4", galleryCount: 17, timeAgo: "2 weeks ago" },
  { id: "5", name: "Folder 5", galleryCount: 20, timeAgo: "1 day ago" },
  { id: "6", name: "Folder 6", galleryCount: 19, timeAgo: "3 days ago" },
  { id: "7", name: "Folder 7", galleryCount: 16, timeAgo: "1 week ago" },
  { id: "8", name: "Folder 8", galleryCount: 5, timeAgo: "2 weeks ago" },
  { id: "9", name: "Folder 9", galleryCount: 22, timeAgo: "1 day ago" },
  { id: "10", name: "Folder 10", galleryCount: 18, timeAgo: "3 days ago" },
  { id: "11", name: "Folder 11", galleryCount: 16, timeAgo: "1 week ago" },
  { id: "12", name: "Folder 12", galleryCount: 14, timeAgo: "2 weeks ago" },
];

interface FolderItem {
  id: string;
  name: string;
  subfolderCount?: number;
  children?: FolderItem[];
}

const folders: FolderItem[] = [
  { id: "all", name: "All Files" },
  {
    id: "season-2025",
    name: "Season 2025",
    subfolderCount: 3,
    children: [
      { id: "2025-q1", name: "Q1" },
      { id: "2025-q2", name: "Q2" },
      { id: "2025-q3", name: "Q3" },
    ],
  },
  {
    id: "season-2024",
    name: "Season 2024",
    subfolderCount: 12,
    children: [],
  },
];

interface LibraryScreenV2Props {
  isMobile?: boolean;
}

export function LibraryScreenV2({ isMobile = false }: LibraryScreenV2Props) {
  const [isFolderSidebarExpanded, setIsFolderSidebarExpanded] = useState(true);
  const [activeFolder, setActiveFolder] = useState("all");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("assets");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const toggleFolderExpand = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderFolder = (folder: FolderItem, depth = 0) => {
    const hasChildren = folder.children && folder.children.length > 0;
    const isExpanded = expandedFolders.has(folder.id);
    const isActive = activeFolder === folder.id;

    return (
      <div key={folder.id}>
        <button
          onClick={() => {
            setActiveFolder(folder.id);
            if (hasChildren) toggleFolderExpand(folder.id);
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
            isActive
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          }`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          {hasChildren && (
            <ChevronDown
              className={`w-4 h-4 flex-shrink-0 transition-transform ${
                isExpanded ? "" : "-rotate-90"
              }`}
            />
          )}
          {!hasChildren && folder.id !== "all" && (
            <Folder className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="truncate">{folder.name}</span>
          {folder.subfolderCount && (
            <span className="ml-auto text-xs text-muted-foreground">
              {folder.subfolderCount} folders
            </span>
          )}
        </button>
        {hasChildren && isExpanded && (
          <div>
            {folder.children!.map((child) => renderFolder(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const showFolderSidebar = activeTab === "folders";

  // Advanced Filters Row Component
  const AdvancedFiltersRow = () => (
    <div 
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        showAdvancedFilters ? "max-h-20 opacity-100 mb-4" : "max-h-0 opacity-0"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 pt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <DropdownMenu key={i}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Facet
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
              <DropdownMenuItem>Option 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex">
      {/* Folders Sidebar - Animated show/hide based on tab */}
      <div
        className={`border-r bg-card flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
          showFolderSidebar 
            ? (isFolderSidebarExpanded ? "w-64 opacity-100" : "w-12 opacity-100") 
            : "w-0 opacity-0 border-r-0"
        }`}
      >
        {isFolderSidebarExpanded ? (
          <>
            {/* Sidebar Header - Expanded */}
            <div className="p-4 border-b flex items-center justify-between min-w-64">
              <span className="font-medium text-sm">Folders</span>
              <button
                onClick={() => setIsFolderSidebarExpanded(false)}
                className="p-1 hover:bg-accent rounded transition-colors"
                aria-label="Collapse folders"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Folder List */}
            <div className="flex-1 p-2 overflow-y-auto min-w-64">
              {folders.map((folder) => renderFolder(folder))}
            </div>
          </>
        ) : (
          /* Collapsed State - Icon only */
          <div className="p-2 border-b flex flex-col items-center gap-1 min-w-12">
            <button
              className="p-2 hover:bg-accent rounded transition-colors"
              aria-label="Folders"
            >
              <Folder className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setIsFolderSidebarExpanded(true)}
              className="p-2 hover:bg-accent rounded transition-colors"
              aria-label="Expand folders"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 px-4 md:px-8 xl:px-16 pb-12 ${isMobile ? "pt-[58px]" : "pt-20"}`}>

        {/* Header with title and actions */}
        <div className="py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Library</h1>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  New
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Folder className="w-4 h-4 mr-2" />
                  New Folder
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Plus className="w-4 h-4 mr-2" />
                  New Gallery
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b">
            <TabsList className="bg-transparent h-auto p-0 gap-6">
              <TabsTrigger
                value="assets"
                className="bg-transparent px-0 pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Assets
              </TabsTrigger>
              <TabsTrigger
                value="galleries"
                className="bg-transparent px-0 pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Galleries
              </TabsTrigger>
              <TabsTrigger
                value="folders"
                className="bg-transparent px-0 pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Folders
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="bg-transparent px-0 pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Saved
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="assets" className="flex-1 py-6 mt-0">
            {/* Search Bar with Advanced Filters Button */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <FacetedSearch />
                </div>
                <Button
                  variant="outline"
                  className={`gap-2 transition-colors ${showAdvancedFilters ? "bg-accent" : ""}`}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  Advanced Filters
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Filters Row - Animated */}
            <AdvancedFiltersRow />

            {/* Filters and Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Creator
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>All Creators</DropdownMenuItem>
                    <DropdownMenuItem>Creator 1</DropdownMenuItem>
                    <DropdownMenuItem>Creator 2</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Date Range
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>All Time</DropdownMenuItem>
                    <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
                    <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
                    <DropdownMenuItem>Last Year</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Content Type
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>All Types</DropdownMenuItem>
                    <DropdownMenuItem>Images</DropdownMenuItem>
                    <DropdownMenuItem>Videos</DropdownMenuItem>
                    <DropdownMenuItem>Documents</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Aspect Ratio
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>All Ratios</DropdownMenuItem>
                    <DropdownMenuItem>1:1</DropdownMenuItem>
                    <DropdownMenuItem>16:9</DropdownMenuItem>
                    <DropdownMenuItem>4:3</DropdownMenuItem>
                    <DropdownMenuItem>9:16</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      People
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>All</DropdownMenuItem>
                    <DropdownMenuItem>Person Name</DropdownMenuItem>
                    <DropdownMenuItem>Person Name</DropdownMenuItem>
                    <DropdownMenuItem>Person Name</DropdownMenuItem>
                    <DropdownMenuItem>Person Name</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      120 per Page
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>24 per Page</DropdownMenuItem>
                    <DropdownMenuItem>48 per Page</DropdownMenuItem>
                    <DropdownMenuItem>120 per Page</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Sort
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Date (Newest)</DropdownMenuItem>
                    <DropdownMenuItem>Date (Oldest)</DropdownMenuItem>
                    <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                    <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-r-none">
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none border-x">
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-l-none">
                    <CheckSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mockAssets.map((asset) => (
                <div key={asset.id} className="group cursor-pointer">
                  <div className="aspect-[4/3] border rounded-lg bg-muted/30 flex items-center justify-center mb-2 hover:border-primary/50 transition-colors">
                    <Image className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Image className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{asset.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-0.5">
                    <span>{asset.creator}</span>
                    <span>{asset.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="galleries" className="flex-1 py-6 mt-0">
            {/* Search Bar with Advanced Filters Button */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <FacetedSearch />
                </div>
                <Button
                  variant="outline"
                  className={`gap-2 transition-colors ${showAdvancedFilters ? "bg-accent" : ""}`}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  Advanced Filters
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Filters Row - Animated */}
            <AdvancedFiltersRow />

            {/* Filters and Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Creator
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>All Creators</DropdownMenuItem>
                    <DropdownMenuItem>Creator 1</DropdownMenuItem>
                    <DropdownMenuItem>Creator 2</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Date Range
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>All Time</DropdownMenuItem>
                    <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
                    <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
                    <DropdownMenuItem>Last Year</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Sort
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Date (Newest)</DropdownMenuItem>
                    <DropdownMenuItem>Date (Oldest)</DropdownMenuItem>
                    <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                    <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-r-none">
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-l-none">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Galleries Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockGalleries.map((gallery) => (
                <div key={gallery.id} className="group cursor-pointer border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <div className="aspect-[4/3] border border-dashed rounded-lg bg-muted/30 flex items-center justify-center mb-3">
                    <div className="w-3/4 h-3/4 bg-muted/50 rounded" />
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                    <Images className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{gallery.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{gallery.assetCount} Assets</span>
                    <span>{gallery.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="folders" className="flex-1 py-6 mt-0">
            {/* Search Bar with Advanced Filters Button */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <FacetedSearch />
                </div>
                <Button
                  variant="outline"
                  className={`gap-2 transition-colors ${showAdvancedFilters ? "bg-accent" : ""}`}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  Advanced Filters
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Filters Row - Animated */}
            <AdvancedFiltersRow />

            {/* Filters and Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Creator
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>All Creators</DropdownMenuItem>
                    <DropdownMenuItem>Creator 1</DropdownMenuItem>
                    <DropdownMenuItem>Creator 2</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Date Range
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>All Time</DropdownMenuItem>
                    <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
                    <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
                    <DropdownMenuItem>Last Year</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Sort
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Date (Newest)</DropdownMenuItem>
                    <DropdownMenuItem>Date (Oldest)</DropdownMenuItem>
                    <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                    <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-r-none">
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-l-none">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Folders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockFolderCards.map((folder) => (
                <div key={folder.id} className="group cursor-pointer border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <div className="aspect-[4/3] border rounded-lg bg-muted/30 flex items-center justify-center mb-3">
                    <Folder className="w-12 h-12 text-muted-foreground/70" />
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                    <Folder className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{folder.galleryCount} Galleries</span>
                    <span>{folder.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="flex-1 py-6 mt-0">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
              <p>Saved content placeholder</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
