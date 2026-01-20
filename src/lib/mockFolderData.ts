export type ItemType = "folder" | "gallery";

export interface FolderItem {
  id: string;
  name: string;
  type: ItemType;
  count?: number;
  countType?: "folders" | "galleries" | "assets";
  children?: FolderItem[];
}

export interface Gallery {
  id: string;
  name: string;
  assetCount: number;
  timeAgo: string;
}

export interface FolderCard {
  id: string;
  name: string;
  galleryCount: number;
  timeAgo: string;
}

export const folders: FolderItem[] = [
  { id: "all", name: "All Files", type: "folder" },
  {
    id: "season-2025",
    name: "Season 25-26",
    type: "folder",
    count: 3,
    countType: "folders",
    children: [
      { 
        id: "in-game", 
        name: "In-Game", 
        type: "folder",
        count: 2,
        countType: "galleries",
        children: [
          { id: "scoring-highlights", name: "Scoring Highlights", type: "gallery", count: 48, countType: "assets" },
          { id: "rebounds-reels", name: "Rebounds Reels", type: "gallery", count: 48, countType: "assets" },
        ],
      },
      { 
        id: "training", 
        name: "Training", 
        type: "folder",
        count: 8,
        countType: "galleries",
      },
      { 
        id: "fan-engagement", 
        name: "Fan Engagement", 
        type: "folder",
        count: 5,
        countType: "galleries",
      },
      { 
        id: "big-moments", 
        name: "Big Moments", 
        type: "gallery",
        count: 48,
        countType: "assets",
      },
    ],
  },
  {
    id: "season-2024",
    name: "Season 24-25",
    type: "folder",
    count: 3,
    countType: "folders",
    children: [
      { 
        id: "in-game-2024", 
        name: "In-Game", 
        type: "folder",
        count: 2,
        countType: "galleries",
        children: [
          { id: "scoring-highlights-2024", name: "Scoring Highlights", type: "gallery", count: 48, countType: "assets" },
          { id: "rebounds-reels-2024", name: "Rebounds Reels", type: "gallery", count: 48, countType: "assets" },
        ],
      },
      { 
        id: "training-2024", 
        name: "Training", 
        type: "folder",
        count: 8,
        countType: "galleries",
      },
      { 
        id: "fan-engagement-2024", 
        name: "Fan Engagement", 
        type: "folder",
        count: 5,
        countType: "galleries",
      },
      { 
        id: "big-moments-2024", 
        name: "Big Moments", 
        type: "gallery",
        count: 48,
        countType: "assets",
      },
    ],
  },
  {
    id: "season-2023",
    name: "Season 23-24",
    type: "folder",
    count: 3,
    countType: "folders",
    children: [
      { 
        id: "in-game-2023", 
        name: "In-Game", 
        type: "folder",
        count: 2,
        countType: "galleries",
        children: [
          { id: "scoring-highlights-2023", name: "Scoring Highlights", type: "gallery", count: 48, countType: "assets" },
          { id: "rebounds-reels-2023", name: "Rebounds Reels", type: "gallery", count: 48, countType: "assets" },
        ],
      },
      { 
        id: "training-2023", 
        name: "Training", 
        type: "folder",
        count: 8,
        countType: "galleries",
      },
      { 
        id: "fan-engagement-2023", 
        name: "Fan Engagement", 
        type: "folder",
        count: 5,
        countType: "galleries",
      },
      { 
        id: "big-moments-2023", 
        name: "Big Moments", 
        type: "gallery",
        count: 48,
        countType: "assets",
      },
    ],
  },
];

export const mockGalleries: Gallery[] = [
  { id: "1", name: "Gallery 1", assetCount: 29, timeAgo: "2 days ago" },
  { id: "2", name: "Gallery 2", assetCount: 30, timeAgo: "5 days ago" },
  { id: "3", name: "Gallery 3", assetCount: 53, timeAgo: "1 week ago" },
  { id: "4", name: "Gallery 4", assetCount: 20, timeAgo: "2 weeks ago" },
  { id: "5", name: "Gallery 5", assetCount: 45, timeAgo: "3 weeks ago" },
  { id: "6", name: "Gallery 6", assetCount: 12, timeAgo: "1 month ago" },
];

export const mockFolderCards: FolderCard[] = [
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
