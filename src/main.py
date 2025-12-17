"""
Movie Recommendation System using Content-Based Filtering.

This script:
1. Loads a movies dataset (CSV).
2. Combines text features (title, genre, overview).
3. Converts text to TF-IDF vectors.
4. Computes cosine similarity between movies.
5. Provides a recommend_movies function and a simple CLI.
"""

from pathlib import Path
from typing import List, Dict

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Path to the dataset relative to this file (../dataset/movies.csv)
DATA_PATH = Path(__file__).resolve().parent.parent / "dataset" / "movies.csv"


def load_movies(csv_path: Path = DATA_PATH) -> pd.DataFrame:
    """
    Load the movie dataset from a CSV file and ensure required columns exist.

    Expected columns: title, genre, overview
    """
    if not csv_path.exists():
        raise FileNotFoundError(f"Dataset not found at {csv_path}")

    movies_df = pd.read_csv(csv_path)

    required_columns = {"title", "genre", "overview"}
    missing = required_columns - set(movies_df.columns.str.lower())
    if missing:
        raise ValueError(f"Dataset is missing required columns: {missing}")

    # Standardize column names to lowercase for consistency
    movies_df.columns = movies_df.columns.str.lower()

    # Replace missing text with empty strings to avoid errors in vectorization
    for col in required_columns:
        movies_df[col] = movies_df[col].fillna("")

    return movies_df


def build_similarity_matrix(movies_df: pd.DataFrame):
    """
    Create TF-IDF matrix and cosine similarity matrix from the movie features.

    Returns:
        cosine_sim (np.ndarray): Cosine similarity between all movies.
        indices (pd.Series): Map from movie title (lowercase) to DataFrame index.
    """
    # Combine features into a single text string per movie
    movies_df["combined_features"] = (
        movies_df["title"] + " " + movies_df["genre"] + " " + movies_df["overview"]
    )

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(movies_df["combined_features"])

    # Cosine similarity using linear_kernel is efficient for sparse matrices
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    # Map movie titles to indices for quick lookup (case-insensitive)
    indices = pd.Series(movies_df.index, index=movies_df["title"].str.lower())

    return cosine_sim, indices


def recommend_movies(
    movie_title: str,
    number_of_recommendations: int,
    movies_df: pd.DataFrame,
    cosine_sim: np.ndarray,
    indices: pd.Series,
) -> List[Dict[str, str]]:
    """
    Recommend similar movies based on cosine similarity.

    Args:
        movie_title: Title of the movie the user likes.
        number_of_recommendations: How many similar movies to return.
        movies_df: DataFrame containing movie data.
        cosine_sim: Precomputed cosine similarity matrix.
        indices: Mapping from title (lowercase) to DataFrame index.

    Returns:
        A list of dictionaries with recommended movie info and similarity score.
    """
    if number_of_recommendations < 1:
        raise ValueError("number_of_recommendations must be at least 1.")

    normalized_title = movie_title.strip().lower()
    if normalized_title not in indices:
        raise KeyError(f"Movie '{movie_title}' not found in the dataset.")

    target_idx = indices[normalized_title]

    # Enumerate similarity scores for the target movie against all others
    similarity_scores = list(enumerate(cosine_sim[target_idx]))

    # Sort movies by similarity (highest first), skip the first (it's the same movie)
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    top_matches = similarity_scores[1 : number_of_recommendations + 1]

    recommendations = []
    for movie_idx, score in top_matches:
        recommendations.append(
            {
                "title": movies_df.iloc[movie_idx]["title"],
                "genre": movies_df.iloc[movie_idx]["genre"],
                "similarity_score": round(float(score), 4),
            }
        )

    return recommendations


def interactive_cli(movies_df, cosine_sim, indices):
    """
    Simple command-line interface to get movie recommendations from the user.
    """
    print("\n=== Movie Recommendation System (Content-Based) ===")
    print("Type 'exit' to quit.\n")

    while True:
        user_input = input("Enter a movie title you like: ").strip()
        if user_input.lower() == "exit":
            print("Goodbye!")
            break

        try:
            raw_num = input("How many recommendations would you like? (default 5): ").strip()
            num_recs = int(raw_num) if raw_num else 5
            recs = recommend_movies(user_input, num_recs, movies_df, cosine_sim, indices)

            print(f"\nBecause you liked '{user_input}', you might also enjoy:")
            for idx, rec in enumerate(recs, start=1):
                print(f"{idx}. {rec['title']} ({rec['genre']}) - similarity: {rec['similarity_score']}")
            print()
        except ValueError as ve:
            print(f"Input error: {ve}")
        except KeyError as ke:
            print(ke)


def main():
    """
    Entry point: load data, build similarity matrix, and start CLI.
    """
    movies_df = load_movies(DATA_PATH)
    cosine_sim, indices = build_similarity_matrix(movies_df)

    # Print a quick demo recommendation to show functionality
    demo_movie = movies_df.iloc[0]["title"]
    demo_recs = recommend_movies(demo_movie, 3, movies_df, cosine_sim, indices)
    print(f"Sample recommendations for '{demo_movie}':")
    for rec in demo_recs:
        print(f"- {rec['title']} ({rec['genre']}) - similarity: {rec['similarity_score']}")

    # Start interactive prompt
    interactive_cli(movies_df, cosine_sim, indices)


if __name__ == "__main__":
    main()

