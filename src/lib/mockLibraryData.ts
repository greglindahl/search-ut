// Mock library data for realistic search testing

export interface LibraryAsset {
  id: string;
  name: string;
  creator: string;
  creatorId: string;
  type: "image" | "video";
  dateCreated: Date;
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:3";
  status: "approved" | "pending" | "draft";
  tags: string[];
  fileSize: string;
  dimensions?: string;
  duration?: string;
}

const creators = [
  { id: "john", name: "John Smith" },
  { id: "jane", name: "Jane Doe" },
  { id: "alex", name: "Alex Johnson" },
];

const assetNames = {
  image: [
    "Hero Banner Spring Campaign",
    "Product Shot - Blue Sneakers",
    "Team Photo 2024",
    "Logo Variation Dark",
    "Social Post Background",
    "Email Header Design",
    "Instagram Story Template",
    "Facebook Cover Photo",
    "Product Lifestyle Shot",
    "Brand Pattern Tile",
    "Icon Set Preview",
    "Mockup Phone Display",
    "Billboard Design Draft",
    "Newsletter Banner",
    "Landing Page Hero",
    // NBA player photos
    "Lebron James Pregame Warmup",
    "Steph Curry Three Point Celebration",
    "Kevin Durant Dunk Shot",
    "Giannis Antetokounmpo Block",
    "Luka Doncic Assist Highlight",
  ],
  video: [
    "Brand Anthem 60s",
    "Product Demo Reel",
    "Customer Testimonial - Sarah",
    "Behind the Scenes Footage",
    "Social Teaser 15s",
    "Tutorial How-To Guide",
    "Event Highlight Reel",
    "Animated Logo Intro",
    // NBA player videos
    "Lebron James Slam Dunk Compilation",
    "Lebron James Game Winner vs Celtics",
    "Steph Curry 60 Points Highlights",
    "Kevin Durant Crossover Mix",
    "Giannis Antetokounmpo Fastbreak Dunk",
    "Luka Doncic Behind the Back Pass",
  ],
};
// Tags that match facets from both FacetedSearch (V1) and FacetedPillsSearch (V3)
const tagSets = [
  // Sports tags with team names
  ["football", "team shot (5+)", "candid", "Chiefs"],
  ["basketball", "small group (2-4)", "looking at camera", "Lakers"],
  ["baseball", "solo (1)", "headshot", "Yankees"],
  ["esports", "small group (2-4)", "candid"],
  ["football", "crowd/fans", "landscape", "49ers"],
  ["basketball", "team shot (5+)", "portrait", "Warriors"],
  ["football", "solo (1)", "looking at camera", "Cowboys"],
  ["baseball", "team shot (5+)", "candid", "Dodgers"],
  // Mixed tags with teams
  ["marketing", "social", "football", "Patriots"],
  ["product", "brand", "basketball", "Celtics"],
  ["social", "brand", "baseball", "Red Sox"],
  ["marketing", "product", "esports"],
  ["brand", "football", "Eagles"],
  ["marketing", "basketball", "Heat"],
  ["product", "football", "Packers"],
  ["social", "baseball", "Cubs"],
  ["marketing", "brand", "product", "football", "Bills"],
  ["social", "product", "basketball", "Nets"],
  // NBA player + action + team tags
  ["Lebron James", "dunk", "slam dunk", "basketball", "NBA", "Lakers"],
  ["Lebron James", "game winner", "clutch", "basketball", "NBA", "Lakers", "Cavaliers"],
  ["Steph Curry", "three pointer", "shooting", "basketball", "NBA", "Warriors"],
  ["Steph Curry", "celebration", "basketball", "NBA", "Warriors"],
  ["Kevin Durant", "dunk", "crossover", "basketball", "NBA", "Suns", "Warriors", "Nets"],
  ["Giannis Antetokounmpo", "dunk", "block", "basketball", "NBA", "Bucks"],
  ["Luka Doncic", "assist", "passing", "basketball", "NBA", "Mavericks"],
];

// Helper functions for random generation (used only as fallback)
function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Fixed assets for user testing scenarios
const fixedAssets: LibraryAsset[] = [
  {
    id: "asset-hero-1",
    name: "Lebron James Game Action vs Celtics.jpg",
    creator: "Jane Doe",
    creatorId: "jane",
    type: "image",
    dateCreated: (() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(22, 45, 0, 0); // Last night at 10:45 PM
      return yesterday;
    })(),
    aspectRatio: "16:9",
    status: "approved",
    tags: ["Lebron James", "Lakers", "game action", "basketball", "NBA", "dunk"],
    fileSize: "4.2 MB",
    dimensions: "3840x2160",
  },
];

// Generate 80 mock assets with good distribution of tags
export const mockLibraryAssets: LibraryAsset[] = (() => {
  // Use a simple seeded random for consistent results
  let seed = 12345;
  const seededRandom = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  
  const seededFromArray = <T,>(arr: T[]): T => {
    return arr[Math.floor(seededRandom() * arr.length)];
  };
  
  const seededDate = (daysAgo: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(seededRandom() * daysAgo));
    date.setHours(Math.floor(seededRandom() * 24));
    date.setMinutes(Math.floor(seededRandom() * 60));
    return date;
  };
  
  const generateSeededAsset = (id: number): LibraryAsset => {
    const type = seededFromArray(["image", "video"] as const);
    const names = assetNames[type];
    const creator = seededFromArray(creators);
    const aspectRatio = seededFromArray(["1:1", "16:9", "9:16", "4:3"] as const);
    const status = seededFromArray(["approved", "pending", "draft"] as const);
    const tags = seededFromArray(tagSets);
    
    const fileSizes = {
      image: ["1.2 MB", "2.4 MB", "856 KB", "3.1 MB", "1.8 MB"],
      video: ["45 MB", "120 MB", "28 MB", "250 MB", "85 MB"],
    };

    const dimensions = {
      "1:1": ["1080x1080", "2048x2048", "512x512"],
      "16:9": ["1920x1080", "3840x2160", "1280x720"],
      "9:16": ["1080x1920", "720x1280"],
      "4:3": ["1600x1200", "2048x1536", "1024x768"],
    };

    const durations = ["0:15", "0:30", "1:00", "2:30", "5:00", "10:15"];

    const extension = {
      image: seededFromArray([".png", ".jpg", ".webp"]),
      video: seededFromArray([".mp4", ".mov"]),
    };

    return {
      id: `asset-${id}`,
      name: `${seededFromArray(names)}${extension[type]}`,
      creator: creator.name,
      creatorId: creator.id,
      type,
      dateCreated: seededDate(365),
      aspectRatio,
      status,
      tags,
      fileSize: seededFromArray(fileSizes[type]),
      dimensions: type === "image" || type === "video" ? seededFromArray(dimensions[aspectRatio]) : undefined,
      duration: type === "video" ? seededFromArray(durations) : undefined,
    };
  };
  
  // Combine fixed assets with generated ones
  return [...fixedAssets, ...Array.from({ length: 80 }, (_, i) => generateSeededAsset(i + 1))];
})();

// Helper to get relative time string
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
}

// Filter interface matching facet structure
export interface SearchFilters {
  query: string;
  creator?: string[];
  type?: string[];
  date?: string;
  aspect?: string[];
  status?: string[];
  tag?: string[];
}

// Date filter logic
function matchesDateFilter(date: Date, filter: string): boolean {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

  switch (filter) {
    case "today":
      return diffDays === 0;
    case "week":
      return diffDays <= 7;
    case "month":
      return diffDays <= 30;
    case "year":
      return diffDays <= 365;
    default:
      return true;
  }
}

// Search and filter function
export function searchAssets(assets: LibraryAsset[], filters: SearchFilters): LibraryAsset[] {
  return assets.filter((asset) => {
    // Text query search
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const matchesName = asset.name.toLowerCase().includes(q);
      const matchesCreator = asset.creator.toLowerCase().includes(q);
      const matchesTags = asset.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesName && !matchesCreator && !matchesTags) return false;
    }

    // Creator filter
    if (filters.creator?.length) {
      if (!filters.creator.includes(asset.creatorId)) return false;
    }

    // Type filter
    if (filters.type?.length) {
      if (!filters.type.includes(asset.type)) return false;
    }

    // Date filter
    if (filters.date) {
      if (!matchesDateFilter(asset.dateCreated, filters.date)) return false;
    }

    // Aspect ratio filter
    if (filters.aspect?.length) {
      if (!filters.aspect.includes(asset.aspectRatio)) return false;
    }

    // Status filter
    if (filters.status?.length) {
      if (!filters.status.includes(asset.status)) return false;
    }

    // Tag filter (case-insensitive)
    if (filters.tag?.length) {
      const lowerTags = asset.tags.map(t => t.toLowerCase());
      if (!filters.tag.some((t) => lowerTags.includes(t.toLowerCase()))) return false;
    }

    return true;
  });
}
