import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

const LibraryV2 = () => {
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
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded">V2</span>
            <Link to="/library/v3">
              <span className="text-xs font-medium px-2 py-0.5 rounded hover:bg-accent transition-colors cursor-pointer">V3</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Placeholder Content */}
      <div className="pt-24 px-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Library - Search Variation 2</h1>
        <p className="text-muted-foreground mb-8">This is a placeholder for the second search experience variation.</p>
        
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
          <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">Search Variation 2 placeholder</p>
          <p className="text-sm text-muted-foreground/70 mt-2">Implement your alternative search design here</p>
        </div>
      </div>
    </div>
  );
};

export default LibraryV2;
