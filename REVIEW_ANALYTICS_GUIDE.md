# Review Analytics Feature - User Guide

## Overview

The Review Analytics feature allows you to upload a CSV file containing movie reviews in multiple languages and perform comprehensive sentiment analysis, keyword extraction, and personalized recommendations.

## How to Access

1. Navigate to your dashboard after logging in
2. Click on **"Analytics"** in the navigation menu (the chart icon)
3. You'll see the Review Analytics page with the upload section

## CSV File Format

Your CSV file should have the following structure with these **required columns**:

| Column | Type | Description |
|--------|------|-------------|
| Movie | String | Movie title |
| Review | String | Review text (can be in any language) |
| Rating | Number | Rating from 0-5 (decimals allowed, e.g., 4.5) |
| Genre | String | Movie genre |

### Example CSV

```csv
Movie,Review,Rating,Genre
RRR,Excellent action drama...,4.8,Action
RRR,शानदार फिल्म...,4.7,Action
RRR,அருமையான படம்...,4.6,Action
Pushpa 2,Amazing performance...,4.5,Action
```

### Important Notes

- **Multilingual Support**: Reviews can be in any language (English, Hindi, Tamil, Telugu, etc.)
- **Rating Range**: Must be between 0 and 5
- **Minimum Data**: At least one valid review row required
- **File Size**: Maximum 10MB
- **Format**: Only CSV files accepted

## Download Sample Data

A sample CSV file with 9 movies and 5 reviews each (in 5 different languages) is available for download on the upload page. This helps you understand the expected format.

## Features & Analytics

### 1. Dashboard Overview
- **Movie Cards** with:
  - Movie Title and Genre
  - Average Rating
  - Total Reviews Count
  - Positive Review Percentage (reviews with rating ≥ 4)
  - Top 3 Trending Keywords (automatically extracted)

### 2. Ratings Chart
- **Horizontal Bar Chart** showing:
  - Top 25 movies by rating (highest rated first)
  - Average rating on X-axis (0-5 scale)
  - Movie names on Y-axis
  - Quick statistics (total movies, average rating, highest/lowest rated)

### 3. Smart Recommendation
- **Automatically suggests the highest-rated movie** with:
  - Movie name and genre
  - Average rating and positive review percentage
  - Reason for recommendation
  - Most praised keywords from reviews

### 4. Genre Analysis
- **Genre Performance Insights**:
  - Bar chart showing average ratings by genre
  - Positive sentiment percentage by genre
  - Individual genre cards with statistics
  - Genre rankings by rating

## Understanding the Metrics

### Average Rating
- Calculated as the mean of all ratings for a movie
- Displayed as a decimal (e.g., 4.7/5)

### Positive Review Percentage
- Percentage of reviews with rating ≥ 4.0
- Indicates audience satisfaction level
- Higher percentage = more positive reception

### Top Keywords
- **Automatically extracted** from review text
- Stop words and common words filtered out
- Top 3 most frequently mentioned keywords per movie
- Indicates what audiences appreciate most

### Genre Performance
- Average rating calculated across all movies in that genre
- Highest-rated genres appear first in the rankings

## Tips for Best Results

1. **Use Consistent Movie Names**: Same movie should have identical titles in all rows
2. **Include Multiple Languages**: Reviews in different languages provide better keyword extraction
3. **Provide Enough Data**: At least 3-5 reviews per movie for meaningful analysis
4. **Valid Ratings**: Ensure all ratings are numbers between 0-5
5. **Clear Review Text**: Well-written reviews provide better keyword extraction

## Actions Available

### After Analysis

- **📊 Export Report**: Print or save the analysis as PDF
- **← Analyze Different Data**: Clear current analysis and upload a new CSV file

## How Keyword Extraction Works

The system analyzes all reviews for each movie using intelligent keyword extraction:

1. **Text Processing**: Reviews are converted to lowercase and punctuation removed
2. **Filtering**: Common stop words (the, a, and, etc.) are removed
3. **Frequency Analysis**: Remaining words are counted
4. **Top Selection**: The 3 most frequent words are displayed

This helps identify what audiences appreciate or criticize about each movie.

## Supported Genres

The application supports all genres including:
- Action
- Drama
- Comedy
- Sci-Fi
- Fantasy
- Thriller
- Horror
- Romance
- Crime
- Adventure
- And more...

## Troubleshooting

### "CSV file is empty"
- Your file contains no data rows
- Remove the check and ensure at least one data row exists

### "Missing required columns"
- Your CSV is missing one or more required columns (Movie, Review, Rating, Genre)
- Verify column names match exactly

### "No valid reviews found"
- Ratings are outside 0-5 range
- Rating column contains non-numeric values
- Required columns contain empty values

### Chart not displaying
- Ensure you have at least 2 movies with different ratings
- Check browser console for detailed error messages

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Responsive design supported

## Data Privacy

- All analysis is performed **locally in your browser**
- No data is sent to any server
- File is processed and deleted after analysis
- No tracking or data collection

## Performance Notes

- Processing time depends on file size and number of reviews
- Large files (1000+ reviews) may take a few seconds
- Typical analysis time: < 2 seconds for 37 movies with 185 reviews

---

For more help or to report issues, contact the support team.
