import { LibraryScreen } from "@/components/LibraryScreen";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const LibraryV3 = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Variation Header */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-1.5">
          <span className="text-sm text-muted-foreground">Search Variation:</span>
          <div className="flex items-center gap-1">
            <Link to="/library/v1">
              <span className="text-xs font-medium px-2 py-0.5 rounded hover:bg-accent transition-colors cursor-pointer">V1</span>
            </Link>
            <Link to="/library/v2">
              <span className="text-xs font-medium px-2 py-0.5 rounded hover:bg-accent transition-colors cursor-pointer">V2</span>
            </Link>
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded">V3</span>
          </div>
        </div>
      </div>
      
      <LibraryScreen />
    </div>
  );
};

export default LibraryV3;
