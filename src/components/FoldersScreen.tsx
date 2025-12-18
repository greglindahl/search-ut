import { Folder, FolderPlus } from "lucide-react";
import { Button } from "./ui/button";

interface FoldersScreenProps {
  isMobile?: boolean;
}

export function FoldersScreen({ isMobile = false }: FoldersScreenProps) {
  return (
    <div className={`flex-1 bg-background px-4 md:px-8 xl:px-16 pb-12 ${isMobile ? "pt-[58px]" : "pt-20"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Folder className="w-6 h-6 text-muted-foreground" />
          <h1 className="text-xl font-medium">Folders</h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderPlus className="w-4 h-4" />
          New Folder
        </Button>
      </div>

      {/* Lo-fi content placeholder */}
      <div className="border-2 border-dashed border-border rounded-lg p-8">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Organize your content into folders
          </p>

          {/* Folder grid placeholders */}
          <div className="pt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-24 bg-muted rounded border flex flex-col items-center justify-center gap-2"
              >
                <Folder className="w-8 h-8 text-muted-foreground" />
                <div className="h-3 bg-muted-foreground/20 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
