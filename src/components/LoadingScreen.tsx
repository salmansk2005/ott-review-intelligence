import { Film } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <Film className="w-16 h-16 text-primary animate-pulse-glow mb-4" />
      <div className="w-48 h-1 rounded-full overflow-hidden bg-secondary">
        <div className="h-full bg-primary animate-shimmer rounded-full" style={{ width: "60%" }} />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Loading your experience...</p>
    </div>
  );
}
