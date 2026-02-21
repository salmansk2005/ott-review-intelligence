import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import CSVUpload from "@/components/CSVUpload";
import ReviewDashboard from "@/components/ReviewDashboard";
import RatingChart from "@/components/RatingChart";
import RecommendationBox from "@/components/RecommendationBox";
import GenreInsights from "@/components/GenreInsights";
import {
  ReviewData,
  analyzeReviews,
  AnalysisResult,
  getTopRecommendedMovie,
  getGenreBasedRecommendation,
} from "@/utils/reviewAnalyzer";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, Sparkles, Grid3x3, Layers, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReviewAnalysis() {
  const { getGenrePreference } = useAuth();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleDataLoaded = useCallback((reviewData: ReviewData[]) => {
    setIsLoading(true);

    // Simulate processing delay for better UX
    setTimeout(() => {
      try {
        const result = analyzeReviews(reviewData);
        setAnalysis(result);
        setActiveTab("overview");
      } catch (error) {
        console.error("Error analyzing reviews:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  const clearData = () => {
    setAnalysis(null);
    setActiveTab("upload");
  };

  // Get genre preference from localStorage/context
  const preferredGenre = getGenrePreference();
  
  // Get recommendation based on genre preference
  const recommendationData = analysis 
    ? getGenreBasedRecommendation(analysis.movies, preferredGenre)
    : { movie: null, isGenreFiltered: false };

  const topMovie = recommendationData.movie;
  const isGenreFiltered = recommendationData.isGenreFiltered;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Review Analytics
          </h1>
          <p className="text-muted-foreground">
            Analyze multilingual movie reviews, extract insights, and discover
            recommendations based on audience sentiment
          </p>
        </div>

        {/* No Data State */}
        {!analysis ? (
          <div className="space-y-6">
            <div className="glass rounded-lg border border-border p-6 bg-gradient-to-r from-primary/5 to-purple-500/5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Get Started with Sample Data
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Download our sample CSV file to see the expected format and test the analytics
                  </p>
                </div>
                <a
                  href="/sample-reviews.csv"
                  download="sample-reviews.csv"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  Download Sample CSV
                </a>
              </div>
            </div>

            <div className="min-h-96 flex items-center justify-center">
              <CSVUpload onDataLoaded={handleDataLoaded} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass rounded-lg border border-border p-6 bg-gradient-to-br from-primary/10 to-transparent">
                <p className="text-sm text-muted-foreground mb-2">
                  Total Movies Analyzed
                </p>
                <p className="text-3xl font-bold text-primary">
                  {analysis.overallStats.totalMovies}
                </p>
              </div>
              <div className="glass rounded-lg border border-border p-6 bg-gradient-to-br from-green-500/10 to-transparent">
                <p className="text-sm text-muted-foreground mb-2">
                  Total Reviews
                </p>
                <p className="text-3xl font-bold text-green-500">
                  {analysis.overallStats.totalReviews}
                </p>
              </div>
              <div className="glass rounded-lg border border-border p-6 bg-gradient-to-br from-yellow-500/10 to-transparent">
                <p className="text-sm text-muted-foreground mb-2">
                  Average Rating
                </p>
                <p className="text-3xl font-bold text-yellow-500">
                  {analysis.overallStats.averageRating.toFixed(1)}
                </p>
              </div>
            </div>

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="glass rounded-lg border border-border p-4 mb-6">
                <TabsList className="w-full justify-start gap-4 bg-transparent h-auto p-0">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all"
                  >
                    <Grid3x3 className="w-4 h-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="chart"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Ratings Chart
                  </TabsTrigger>
                  <TabsTrigger
                    value="recommendation"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Recommendation
                  </TabsTrigger>
                  <TabsTrigger
                    value="genres"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all"
                  >
                    <Layers className="w-4 h-4" />
                    Genres
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <ReviewDashboard movies={analysis.movies} isLoading={isLoading} />
              </TabsContent>

              {/* Chart Tab */}
              <TabsContent value="chart" className="space-y-6">
                <RatingChart movies={analysis.movies} isLoading={isLoading} />
              </TabsContent>

              {/* Recommendation Tab */}
              <TabsContent value="recommendation" className="space-y-6">
                <RecommendationBox 
                  movie={topMovie} 
                  isLoading={isLoading}
                  preferredGenre={preferredGenre}
                  isGenreFiltered={isGenreFiltered}
                />
              </TabsContent>

              {/* Genres Tab */}
              <TabsContent value="genres" className="space-y-6">
                <GenreInsights movies={analysis.movies} isLoading={isLoading} />
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <Button
                variant="outline"
                onClick={clearData}
                size="lg"
                className="gap-2"
              >
                ← Analyze Different Data
              </Button>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.print();
                }}
                className="inline-flex items-center justify-center px-6 py-2 text-base font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2"
              >
                📊 Export Report
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
