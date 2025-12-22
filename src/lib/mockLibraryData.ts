// Mock library data for realistic search testing

export interface LibraryAsset {
  id: string;
  name: string;
  creator: string;
  creatorId: string;
  type: "image" | "video" | "document" | "audio";
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
  ],
  document: [
    "Brand Guidelines 2024",
    "Press Kit PDF",
    "Product Spec Sheet",
    "Campaign Brief Q2",
    "Style Guide Update",
    "Presentation Deck",
  ],
  audio: [
    "Podcast Episode 42",
    "Radio Spot 30s",
    "Brand Jingle Master",
    "Interview Raw Audio",
  ],
};

const tagSets = [
  ["marketing", "social"],
  ["product", "brand"],
  ["social", "brand"],
  ["marketing", "product"],
  ["brand"],
  ["marketing"],
  ["product"],
  ["social"],
  ["marketing", "brand", "product"],
  ["social", "product"],
];

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

function generateAsset(id: number): LibraryAsset {
  const type = randomFromArray(["image", "video", "document", "audio"] as const);
  const names = assetNames[type];
  const creator = randomFromArray(creators);
  const aspectRatio = randomFromArray(["1:1", "16:9", "9:16", "4:3"] as const);
  const status = randomFromArray(["approved", "pending", "draft"] as const);
  const tags = randomFromArray(tagSets);
  
  const fileSizes = {
    image: ["1.2 MB", "2.4 MB", "856 KB", "3.1 MB", "1.8 MB"],
    video: ["45 MB", "120 MB", "28 MB", "250 MB", "85 MB"],
    document: ["2.1 MB", "5.4 MB", "890 KB", "1.5 MB"],
    audio: ["8 MB", "15 MB", "4.2 MB", "22 MB"],
  };

  const dimensions = {
    "1:1": ["1080x1080", "2048x2048", "512x512"],
    "16:9": ["1920x1080", "3840x2160", "1280x720"],
    "9:16": ["1080x1920", "720x1280"],
    "4:3": ["1600x1200", "2048x1536", "1024x768"],
  };

  const durations = ["0:15", "0:30", "1:00", "2:30", "5:00", "10:15"];

  const extension = {
    image: randomFromArray([".png", ".jpg", ".webp"]),
    video: randomFromArray([".mp4", ".mov"]),
    document: randomFromArray([".pdf", ".pptx"]),
    audio: randomFromArray([".mp3", ".wav"]),
  };

  return {
    id: `asset-${id}`,
    name: `${randomFromArray(names)}${extension[type]}`,
    creator: creator.name,
    creatorId: creator.id,
    type,
    dateCreated: randomDate(365),
    aspectRatio,
    status,
    tags,
    fileSize: randomFromArray(fileSizes[type]),
    dimensions: type === "image" || type === "video" ? randomFromArray(dimensions[aspectRatio]) : undefined,
    duration: type === "video" || type === "audio" ? randomFromArray(durations) : undefined,
  };
}

// Generate 80 mock assets
export const mockLibraryAssets: LibraryAsset[] = Array.from({ length: 80 }, (_, i) => generateAsset(i + 1));

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

    // Tag filter
    if (filters.tag?.length) {
      if (!filters.tag.some((t) => asset.tags.includes(t))) return false;
    }

    return true;
  });
}
