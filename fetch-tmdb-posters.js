#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TMDB_API_KEY = '09c7281b46f18ec883c451ef3c391820';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/search/movie';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

function fetchTMDBData(title, year) {
  return new Promise((resolve, reject) => {
    const query = `${title} ${year}`;
    const url = `${TMDB_BASE_URL}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.results && result.results.length > 0) {
            // Find the best match (prefer 2024, then by popularity)
            let bestMatch = result.results[0];
            for (let i = 0; i < result.results.length; i++) {
              const movie = result.results[i];
              if (movie.poster_path) {
                if (movie.release_date && movie.release_date.includes('2024')) {
                  bestMatch = movie;
                  break;
                }
                if (!bestMatch.poster_path) {
                  bestMatch = movie;
                }
              }
            }

            if (bestMatch.poster_path) {
              resolve(`${TMDB_IMAGE_BASE}${bestMatch.poster_path}`);
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function updatePosters() {
  console.log('🎬 Fetching TMDB poster URLs...\n');

  const moviesFile = path.join(__dirname, 'src', 'data', 'movies.ts');
  let fileContent = fs.readFileSync(moviesFile, 'utf-8');

  const posterMap = {};
  let successCount = 0;

  // Extract all movie titles
  const movieRegex = /title: "([^"]+)"/g;
  const titles = [...new Set([...fileContent.matchAll(movieRegex)].map(m => m[1]))];

  for (let i = 0; i < titles.length; i++) {
    const title = titles[i];

    try {
      console.log(`[${i + 1}/${titles.length}] Fetching: ${title}...`);
      const posterUrl = await fetchTMDBData(title, 2024);

      if (posterUrl) {
        posterMap[title] = posterUrl;
        successCount++;
        console.log(`✅ Found: ${posterUrl}\n`);
      } else {
        console.log(`⚠️  No poster found for: ${title}\n`);
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`❌ Error fetching ${title}:`, error.message);
    }
  }

  console.log('\n📝 Updating movies.ts with new poster URLs...');

  // Replace each poster URL
  Object.entries(posterMap).forEach(([title, posterUrl]) => {
    // Match pattern: title: "Movie Title", poster: "old_url"
    const pattern = `title: "${title}", poster: "`;
    const startIdx = fileContent.indexOf(pattern);

    if (startIdx !== -1) {
      const posterStartIdx = startIdx + pattern.length;
      const posterEndIdx = fileContent.indexOf('"', posterStartIdx);

      if (posterEndIdx !== -1) {
        const beforePoster = fileContent.substring(0, posterStartIdx);
        const afterPoster = fileContent.substring(posterEndIdx);
        fileContent = beforePoster + posterUrl + afterPoster;
      }
    }
  });

  fs.writeFileSync(moviesFile, fileContent);
  console.log(`\n✅ Successfully updated ${successCount} movie posters!`);
  console.log('🎉 Your movie posters now display real TMDB poster images!');
  console.log('Run "npm run dev" to see your updated website!');
}

updatePosters().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
