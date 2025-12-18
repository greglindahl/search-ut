import { useState } from "react";
import { ChevronLeft, ChevronRight, Folder, ChevronDown, Plus, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface LibraryScreenProps {
  isMobile?: boolean;
}

export function LibraryScreen({ isMobile = false }: LibraryScreenProps) {
  const [isFolderSidebarExpanded, setIsFolderSidebarExpanded] = useState(true);
  const [activeFolder, setActiveFolder] = useState("all");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("assets");

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

  return (
    <div className="flex-1 flex">
      {/* Folders Sidebar - Only show when Folders tab is active */}
      {showFolderSidebar && (
        <div
          className={`border-r bg-card flex flex-col transition-all duration-200 ${
            isFolderSidebarExpanded ? "w-64" : "w-12"
          }`}
        >
        {isFolderSidebarExpanded ? (
          <>
            {/* Sidebar Header - Expanded */}
            <div className="p-4 border-b flex items-center justify-between">
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
            <div className="flex-1 p-2 overflow-y-auto">
              {folders.map((folder) => renderFolder(folder))}
            </div>
          </>
        ) : (
          /* Collapsed State - Icon only */
          <div className="p-2 border-b flex flex-col items-center gap-1">
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
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 px-4 md:px-8 xl:px-16 pb-12 ${isMobile ? "pt-[58px]" : "pt-20"}`}>
        {/* Breadcrumb - Only show when Folders tab is active */}
        {showFolderSidebar && (
          <div className="pt-4 flex items-center gap-2 text-sm text-muted-foreground">
            {!isFolderSidebarExpanded && (
              <button
                onClick={() => setIsFolderSidebarExpanded(true)}
                className="p-1 hover:bg-accent rounded transition-colors mr-2"
                aria-label="Expand folders"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <span>All Files</span>
          </div>
        )}

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
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
              <p>Assets content placeholder</p>
            </div>
          </TabsContent>

          <TabsContent value="galleries" className="flex-1 py-6 mt-0">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
              <p>Galleries content placeholder</p>
            </div>
          </TabsContent>

          <TabsContent value="folders" className="flex-1 py-6 mt-0">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
              <p>Folders content placeholder</p>
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
