import { useState, useCallback, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Folder, ChevronDown, Plus, Upload, Grid3X3, List, CheckSquare, Image, Images, FileText, Music, Video, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FacetedSearchWithTypeahead } from "@/components/FacetedSearchWithTypeahead";
import { FilterBar } from "@/components/FilterBar";
import { useLibrarySearch } from "@/hooks/useLibrarySearch";
import { getRelativeTime, LibraryAsset } from "@/lib/mockLibraryData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icon component for asset types
function AssetTypeIcon({ type, className }: { type: LibraryAsset["type"]; className?: string }) {
  switch (type) {
    case "video":
      return <Video className={className} />;
    default:
      return <Image className={className} />;
  }
}


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

// Helper to compute dynamic counts for filter dropdowns
function computeFilterCounts(assets: LibraryAsset[]) {
  const creators: Record<string, number> = {};
  const contentTypes: Record<string, number> = { image: 0, video: 0, document: 0, audio: 0 };
  const aspectRatios: Record<string, number> = { "1:1": 0, "16:9": 0, "4:3": 0, "9:16": 0 };

  assets.forEach(asset => {
    // Creator counts
    creators[asset.creator] = (creators[asset.creator] || 0) + 1;
    // Content type counts
    contentTypes[asset.type] = (contentTypes[asset.type] || 0) + 1;
    // Aspect ratio counts
    aspectRatios[asset.aspectRatio] = (aspectRatios[asset.aspectRatio] || 0) + 1;
  });

  return { creators, contentTypes, aspectRatios, total: assets.length };
}

interface LibraryScreenProps {
  isMobile?: boolean;
}

export function LibraryScreen({ isMobile = false }: LibraryScreenProps) {
  const [activeTab, setActiveTab] = useState("assets");
  // Default expanded on folders tab, collapsed on other tabs
  const [isFolderSidebarExpanded, setIsFolderSidebarExpanded] = useState(false);
  const [activeFolder, setActiveFolder] = useState("all");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  
  // Auto-expand/collapse sidebar based on active tab
  useEffect(() => {
    setIsFolderSidebarExpanded(activeTab === "folders");
  }, [activeTab]);
  const [contentTypeFilter, setContentTypeFilter] = useState<"all" | "image" | "video">("all");
  const [creatorFilter, setCreatorFilter] = useState<string>("all");
  const [aspectRatioFilter, setAspectRatioFilter] = useState<string>("all");
  const [peopleFilter, setPeopleFilter] = useState<string>("all");
  
  // Use the library search hook
  const { results, allAssets, isLoading, totalCount, search } = useLibrarySearch();

  // Get unique creators and people from all assets
  const uniqueCreators = useMemo(() => {
    const creators = new Set(allAssets.map(a => a.creator));
    return Array.from(creators).sort();
  }, [allAssets]);

  // Extract people from tags (tags that look like names)
  const uniquePeople = useMemo(() => {
    const people = new Set<string>();
    const excludedItems = ["looking at camera", "slam dunk", "Red Sox", "three pointer"];
    allAssets.forEach(asset => {
      asset.tags.forEach(tag => {
        // Consider tags with spaces as potential people names, exclude non-people items
        if (tag.includes(" ") && !tag.includes("(") && !tag.toLowerCase().includes("shot") && !excludedItems.includes(tag)) {
          people.add(tag);
        }
      });
    });
    return Array.from(people).sort();
  }, [allAssets]);

  // Filter results by all active filters
  const filteredResults = useMemo(() => {
    return results.filter(asset => {
      // Content type filter
      if (contentTypeFilter !== "all" && asset.type !== contentTypeFilter) return false;
      // Creator filter
      if (creatorFilter !== "all" && asset.creator !== creatorFilter) return false;
      // Aspect ratio filter
      if (aspectRatioFilter !== "all" && asset.aspectRatio !== aspectRatioFilter) return false;
      // People filter (check tags)
      if (peopleFilter !== "all" && !asset.tags.some(t => t.toLowerCase() === peopleFilter.toLowerCase())) return false;
      return true;
    });
  }, [results, contentTypeFilter, creatorFilter, aspectRatioFilter, peopleFilter]);

  // Compute dynamic filter counts based on current results
  const filterCounts = useMemo(() => computeFilterCounts(filteredResults), [filteredResults]);

  // Handle search from FacetedSearch component
  const handleSearch = useCallback((query: string, selectedFacets: string[]) => {
    // Convert string facets to facet objects for the search hook
    const facets = selectedFacets.map(facet => ({
      field: "tag",
      value: facet.toLowerCase(),
      label: facet,
    }));
    search(query, facets);
  }, [search]);

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

  // Determine if we should show expanded sidebar (user can toggle on any tab)
  const isFoldersTab = activeTab === "folders";

  return (
    <div className="flex-1 flex">
      {/* Folders Sidebar - Always visible, toggleable on all tabs */}
      <div
        className={`border-r bg-card flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
          isFolderSidebarExpanded ? "w-64 opacity-100" : "w-12 opacity-100"
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
          /* Collapsed State - Icon with expand button */
          <div className="p-2 flex flex-col items-center gap-1 min-w-12">
            <button
              onClick={() => setIsFolderSidebarExpanded(true)}
              className="p-2 hover:bg-accent rounded transition-colors"
              aria-label="Expand folders"
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
            {/* Faceted Search */}
            <div className="mb-4">
              <FacetedSearchWithTypeahead onSearch={handleSearch} assets={allAssets} />
            </div>

            {/* Filters and Controls - Single Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-3 rounded-lg">
              <FilterBar />

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5 text-xs font-medium">
                      120 per Page
                      <ChevronDown className="w-3 h-3 opacity-50" />
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
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5 text-xs font-medium">
                      Sort
                      <ChevronDown className="w-3 h-3 opacity-50" />
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-r-none">
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-x">
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-l-none">
                    <CheckSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>


            {/* Assets Grid with Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="group">
                    <Skeleton className="aspect-[4/3] rounded-lg mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Image className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-1">No assets found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredResults.map((asset) => (
                  <div key={asset.id} className="group cursor-pointer">
                    <div className="aspect-[4/3] border rounded-lg bg-muted/30 flex flex-col items-center justify-center mb-2 hover:border-primary/50 transition-colors relative overflow-hidden">
                      <AssetTypeIcon type={asset.type} className="w-8 h-8 text-muted-foreground/50" />
                      {asset.dimensions && (
                        <span className="text-[10px] text-muted-foreground/50 mt-1">{asset.dimensions}</span>
                      )}
                      {asset.duration && (
                        <span className="absolute bottom-2 right-2 text-[10px] bg-background/80 px-1 rounded">{asset.duration}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <AssetTypeIcon type={asset.type} className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{asset.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-0.5">
                      <span className="truncate">{asset.creator}</span>
                      <span className="flex-shrink-0">{getRelativeTime(asset.dateCreated)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-muted-foreground">{asset.fileSize}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="galleries" className="flex-1 py-6 mt-0">
            {/* Faceted Search */}
            <div className="mb-4">
              <FacetedSearchWithTypeahead />
            </div>

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
            {/* Faceted Search */}
            <div className="mb-4">
              <FacetedSearchWithTypeahead />
            </div>

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
