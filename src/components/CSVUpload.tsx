import {  useState } from "react";
import { Upload, X } from "lucide-react";
import Papa from "papaparse";
import { ReviewData } from "@/utils/reviewAnalyzer";
import { Button } from "@/components/ui/button";

interface CSVUploadProps {
  onDataLoaded: (data: ReviewData[]) => void;
  isLoading?: boolean;
}

export default function CSVUpload({ onDataLoaded, isLoading = false }: CSVUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setFileName(file.name);

    // Parse CSV using PapaParse
    Papa.parse(file, {
      header: true, // Use first row as column headers
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Validate required columns
          if (results.data.length === 0) {
            setError("CSV file is empty");
            return;
          }

          const firstRow = results.data[0] as Record<string, string>;
          const requiredColumns = ["Movie", "Review", "Rating", "Genre"];
          const missingColumns = requiredColumns.filter(
            col => !(col in firstRow)
          );

          if (missingColumns.length > 0) {
            setError(
              `Missing required columns: ${missingColumns.join(", ")}`
            );
            return;
          }

          // Transform data to ReviewData format
          const reviewData: ReviewData[] = (results.data as Record<string, string>[])
            .map((row) => ({
              movie: row.Movie?.trim() || "",
              review: row.Review?.trim() || "",
              rating: parseFloat(row.Rating) || 0,
              genre: row.Genre?.trim() || "",
            }))
            .filter(
              (item) =>
                item.movie &&
                item.review &&
                item.rating > 0 &&
                item.rating <= 5 &&
                item.genre
            );

          if (reviewData.length === 0) {
            setError(
              "No valid reviews found. Please check your CSV format."
            );
            return;
          }

          onDataLoaded(reviewData);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Error parsing CSV file"
          );
        }
      },
      error: (error) => {
        setError(`Error reading file: ${error.message}`);
      },
    });
  };

  const handleClear = () => {
    setFileName(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass rounded-lg border border-border p-8">
        <div className="flex flex-col items-center">
          {!fileName ? (
            <>
              <label className="flex flex-col items-center justify-center w-full cursor-pointer group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 group-hover:opacity-80 transition-opacity">
                  <Upload className="w-12 h-12 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold text-foreground">
                    Click to upload CSV
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or drag and drop
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  disabled={isLoading}
                  className="hidden"
                  aria-label="Upload CSV file"
                />
              </label>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                CSV must contain: Movie, Review, Rating, Genre
              </p>
            </>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between bg-primary/10 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      Ready for analysis
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  className="p-1 hover:bg-primary/20 rounded transition-colors"
                  aria-label="Clear file"
                >
                  <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 w-full">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="mt-6 w-full">
            <Button
              className="w-full"
              disabled={!fileName || isLoading}
              size="lg"
            >
              {isLoading ? "Processing..." : "Analyze Reviews"}
            </Button>

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Need a sample? 
              </p>
              <a
                href="/sample-reviews.csv"
                download="sample-reviews.csv"
                className="text-xs text-primary hover:underline"
              >
                Download sample CSV file
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
