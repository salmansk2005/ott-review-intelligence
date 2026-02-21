import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Film, Mail, Lock, User, Sparkles } from "lucide-react";

// Available genres for personalization
const AVAILABLE_GENRES = [
  "Action",
  "Sci-Fi",
  "Drama",
  "Comedy",
  "Thriller",
  "Romance",
  "Fantasy",
  "Horror"
];

export default function Login() {
  const { login, signup, user, setGenrePreference } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate genre is selected
    if (!selectedGenre) {
      return setError("Please select a genre");
    }

    if (isSignup) {
      if (!name.trim()) return setError("Name is required");
      const ok = signup(name, email, password);
      if (!ok) return setError("Email already registered");
    } else {
      const ok = login(email, password);
      if (!ok) return setError("Invalid email or password");
    }
    
    // Save genre and redirect
    setGenrePreference(selectedGenre);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md glass rounded-2xl p-8 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
            <Film className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">OTT Review Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">{isSignup ? "Create your account" : "Welcome back"}</p>
        </div>

        {/* Login/Signup Form with Genre Selection */}
        <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-secondary text-foreground border border-border rounded-lg pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-secondary text-foreground border border-border rounded-lg pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={4}
                  className="w-full bg-secondary text-foreground border border-border rounded-lg pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              {/* Genre Selection */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Select your preferred genre for recommendations
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_GENRES.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => setSelectedGenre(genre)}
                      className={`p-2 rounded-lg border transition-all text-sm font-medium ${
                        selectedGenre === genre
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-foreground border-border hover:bg-primary/10 hover:border-primary"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold hover:opacity-90 transition-opacity"
              >
                {isSignup ? "Sign Up" : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => { setIsSignup(!isSignup); setError(""); }}
                className="text-primary hover:underline font-medium"
              >
                {isSignup ? "Login" : "Sign Up"}
              </button>
            </p>
      </div>
    </div>
  );
}
