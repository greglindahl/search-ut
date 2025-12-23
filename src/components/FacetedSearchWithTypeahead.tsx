import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, X, User, Tag, Folder, FileType } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LibraryAsset } from "@/lib/mockLibraryData";

interface FacetGroup {
  label: string;
  facets: string[];
}

const facetGroups: FacetGroup[] = [
  {
    label: "Content & Context",
    facets: [
      "Football", "Basketball", "Baseball", "Esports",
      "Solo (1)", "Small Group (2-4)", "Team Shot (5+)", "Crowd/Fans",
      "Looking at Camera", "Candid", "Headshot",
    ],
  },
  {
    label: "Media Type",
    facets: ["Photo", "Video", "Graphic", "Audio", "Document"],
  },
  {
    label: "Orientation",
    facets: ["Landscape", "Portrait", "Square"],
  },
  {
    label: "Resolution",
    facets: ["8192x5464", "6000x4000", "5712x3808", "5790x3860", "5705x3803", "5754x3836", "5380x3587"],
  },
  {
    label: "File Format",
    facets: ["JPG", "PNG", "HEIC", "MP4", "MOV", "ProRes"],
  },
  {
    label: "Video Duration",
    facets: ["0-15s", "15-30s", "30-60s", "60s+"],
  },
  {
    label: "Workflow",
    facets: ["Active", "Archived", "Embargoed", "Approved", "Pending Review", "Has Audio"],
  },
];

interface Suggestion {
  type: "asset" | "creator" | "tag" | "facet";
  value: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface FacetedSearchWithTypeaheadProps {
  onSearch?: (query: string, selectedFacets: string[]) => void;
  onFacetCountsChange?: (counts: Record<string, number>) => void;
  assets?: LibraryAsset[];
}

// Helper to filter assets based on query and facets
function filterAssets(assets: LibraryAsset[], query: string, selectedFacets: string[]): LibraryAsset[] {
  return assets.filter(asset => {
    // Text query match
    if (query) {
      const q = query.toLowerCase();
      const matchesName = asset.name.toLowerCase().includes(q);
      const matchesCreator = asset.creator.toLowerCase().includes(q);
      const matchesTags = asset.tags.some(t => t.toLowerCase().includes(q));
      if (!matchesName && !matchesCreator && !matchesTags) return false;
    }

    // Facet match
    if (selectedFacets.length > 0) {
      const lowerFacets = selectedFacets.map(f => f.toLowerCase());
      const matchesFacet = lowerFacets.some(facet => 
        asset.tags.some(tag => tag.toLowerCase() === facet) ||
        asset.type.toLowerCase() === facet ||
        (facet === "photo" && asset.type === "image") ||
        (facet === "video" && asset.type === "video") ||
        (facet === "audio" && asset.type === "audio") ||
        (facet === "document" && asset.type === "document")
      );
      if (!matchesFacet) return false;
    }

    return true;
  });
}

// Helper to count assets matching a facet within filtered results
function countAssetsForFacet(assets: LibraryAsset[], facet: string): number {
  const lowerFacet = facet.toLowerCase();
  return assets.filter(asset => 
    asset.tags.some(tag => tag.toLowerCase() === lowerFacet) ||
    asset.type.toLowerCase() === lowerFacet ||
    (facet.toLowerCase() === "photo" && asset.type === "image") ||
    (facet.toLowerCase() === "video" && asset.type === "video") ||
    (facet.toLowerCase() === "audio" && asset.type === "audio") ||
    (facet.toLowerCase() === "document" && asset.type === "document")
  ).length;
}

export function FacetedSearchWithTypeahead({ onSearch, onFacetCountsChange, assets = [] }: FacetedSearchWithTypeaheadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFacets, setSelectedFacets] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter assets based on current query and selected facets
  const filteredAssets = useMemo(() => {
    return filterAssets(assets, searchQuery, selectedFacets);
  }, [assets, searchQuery, selectedFacets]);

  // Compute dynamic facet counts based on filtered assets
  const facetCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    facetGroups.forEach(group => {
      group.facets.forEach(facet => {
        counts[facet] = countAssetsForFacet(filteredAssets, facet);
      });
    });
    return counts;
  }, [filteredAssets]);

  // Notify parent of facet count changes
  useEffect(() => {
    onFacetCountsChange?.(facetCounts);
  }, [facetCounts, onFacetCountsChange]);

  // Trigger search when query or facets change
  useEffect(() => {
    onSearch?.(searchQuery, selectedFacets);
  }, [searchQuery, selectedFacets, onSearch]);

  // Generate typeahead suggestions based on query
  const suggestions = useMemo((): Suggestion[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: Suggestion[] = [];

    // Get unique creators from filtered assets
    const creators = [...new Set(filteredAssets.map(a => a.creator))];
    creators
      .filter(c => c.toLowerCase().includes(query))
      .slice(0, 3)
      .forEach(creator => {
        const count = filteredAssets.filter(a => a.creator === creator).length;
        results.push({
          type: "creator",
          value: creator,
          label: creator,
          icon: <User className="w-4 h-4 text-muted-foreground" />,
          count,
        });
      });

    // Get unique tags from filtered assets
    const allTags = [...new Set(filteredAssets.flatMap(a => a.tags))];
    allTags
      .filter(t => t.toLowerCase().includes(query))
      .slice(0, 3)
      .forEach(tag => {
        const count = filteredAssets.filter(a => a.tags.includes(tag)).length;
        results.push({
          type: "tag",
          value: tag,
          label: tag,
          icon: <Tag className="w-4 h-4 text-muted-foreground" />,
          count,
        });
      });

    // Match facets
    facetGroups.forEach(group => {
      group.facets
        .filter(f => f.toLowerCase().includes(query) && !selectedFacets.includes(f))
        .slice(0, 2)
        .forEach(facet => {
          const count = facetCounts[facet] || 0;
          if (count > 0) {
            results.push({
              type: "facet",
              value: facet,
              label: `${group.label}: ${facet}`,
              icon: <Folder className="w-4 h-4 text-muted-foreground" />,
              count,
            });
          }
        });
    });

    // Match asset names
    filteredAssets
      .filter(a => a.name.toLowerCase().includes(query))
      .slice(0, 4)
      .forEach(asset => {
        results.push({
          type: "asset",
          value: asset.name,
          label: asset.name,
          icon: <FileType className="w-4 h-4 text-muted-foreground" />,
        });
      });

    return results.slice(0, 8);
  }, [searchQuery, filteredAssets, selectedFacets, facetCounts]);

  const handleFacetToggle = useCallback((facet: string) => {
    setSelectedFacets((prev) =>
      prev.includes(facet) ? prev.filter((f) => f !== facet) : [...prev, facet]
    );
  }, []);

  const handleRemoveFacet = useCallback((facet: string) => {
    setSelectedFacets((prev) => prev.filter((f) => f !== facet));
  }, []);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedFacets([]);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === "facet" || suggestion.type === "tag") {
      handleFacetToggle(suggestion.value);
      setSearchQuery("");
    } else if (suggestion.type === "creator") {
      // Add creator as a search term
      setSearchQuery(suggestion.value);
    } else if (suggestion.type === "asset") {
      setSearchQuery(suggestion.value);
    }
    setIsOpen(false);
  };

  const showTypeahead = isOpen && searchQuery.trim().length > 0 && suggestions.length > 0;
  const showFacetsPreview = isOpen && searchQuery.trim().length === 0;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          placeholder="Search by keyword, tag, player, team, season etc."
          className="pl-10 pr-10 w-full bg-background"
        />
        {(searchQuery || selectedFacets.length > 0) && (
          <button
            onClick={handleClearAll}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Selected Facets Pills */}
      {selectedFacets.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedFacets.map((facet) => (
            <Badge
              key={facet}
              variant="secondary"
              className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => handleRemoveFacet(facet)}
            >
              {facet}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* Facets Preview Dropdown (shown on focus before typing) */}
      {showFacetsPreview && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50">
          <ScrollArea className="h-[400px]">
            <div className="p-3">
              {facetGroups.map((group) => (
                <div key={group.label} className="mb-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {group.label}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {group.facets.map((facet) => {
                      const count = facetCounts[facet] || 0;
                      const isSelected = selectedFacets.includes(facet);
                      return (
                        <Badge
                          key={facet}
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer hover:bg-accent transition-colors text-xs ${count === 0 && !isSelected ? "opacity-50" : ""}`}
                          onClick={() => handleFacetToggle(facet)}
                        >
                          {facet}
                          {assets.length > 0 && (
                            <span className="ml-1 text-[10px] opacity-70">({count})</span>
                          )}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Typeahead Suggestions Dropdown (shown when typing) */}
      {showTypeahead && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50">
          <ScrollArea className="max-h-[300px]">
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
                Suggestions ({filteredAssets.length} results)
              </div>
              {suggestions.map((suggestion, idx) => (
                <button
                  key={`${suggestion.type}-${suggestion.value}-${idx}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center justify-between gap-2 px-2 py-2 text-sm text-left rounded hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {suggestion.icon}
                    <span className="truncate">{suggestion.label}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 flex-shrink-0">
                      {suggestion.type}
                    </Badge>
                  </div>
                  {suggestion.count !== undefined && (
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {suggestion.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

// Export the facet groups for use in parent components
export { facetGroups };
export type { FacetGroup };
