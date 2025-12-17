"""
Dataset Generation Script for Movie Recommendation System
Generates a CSV file with ~15,000 movies from Hollywood, Bollywood, and Lollywood industries.
"""

import csv
import random
from pathlib import Path

# Industry definitions
INDUSTRIES = {
    "Hollywood": {
        "language": "English",
        "genres": [
            "Action", "Adventure", "Comedy", "Drama", "Horror", "Romance",
            "Sci-Fi", "Thriller", "Fantasy", "Crime", "Mystery", "Animation",
            "Documentary", "War", "Western", "Musical", "Biography"
        ],
        "name_patterns": [
            "The", "A", "In", "Beyond", "Lost", "Dark", "Red", "Blue", "Green",
            "Final", "Last", "First", "New", "Old", "Young", "Great", "Little"
        ],
        "titles": [
            "Guardian", "Legacy", "Journey", "Revenge", "Justice", "Hope",
            "Destiny", "Courage", "Freedom", "Echo", "Shadow", "Light",
            "Storm", "Fire", "Ice", "Dawn", "Dusk", "Dream", "Night",
            "Day", "Time", "Space", "World", "City", "River", "Mountain",
            "Ocean", "Star", "Moon", "Sun", "Warrior", "Hero", "King",
            "Queen", "Prince", "Princess", "Legend", "Myth", "Tale",
            "Story", "Chronicle", "Code", "Secret", "Mission", "Quest"
        ]
    },
    "Bollywood": {
        "language": "Hindi",
        "genres": [
            "Drama", "Romance", "Comedy", "Action", "Thriller", "Family",
            "Musical", "Crime", "Horror", "Biography", "Sports", "Adventure",
            "Historical", "Social", "Period", "Suspense"
        ],
        "name_patterns": [
            "Mera", "Teri", "Hum", "Kya", "Jab", "Kabhi", "Aap", "Dil",
            "Pyar", "Ishq", "Dost", "Yaar", "Zindagi", "Sapna", "Aasman"
        ],
        "titles": [
            "Dil", "Mohabbat", "Ishq", "Pyar", "Dosti", "Yaari", "Wafa",
            "Dard", "Khushi", "Gham", "Hasina", "Raja", "Rani", "Beta",
            "Bhai", "Didi", "Maa", "Papa", "Dharam", "Karma", "Kismat",
            "Naseeb", "Taqdeer", "Jannat", "Duniya", "Desh", "Watan",
            "Vatan", "Dil", "Jigar", "Roop", "Rang", "Raat", "Din",
            "Saal", "Yeh", "Woh", "Tum", "Main"
        ]
    },
    "Lollywood": {
        "language": "Urdu",
        "genres": [
            "Drama", "Romance", "Comedy", "Action", "Family", "Social",
            "Thriller", "Crime", "Horror", "Biography", "Musical", "Adventure"
        ],
        "name_patterns": [
            "Mere", "Tumhare", "Hum", "Kya", "Jab", "Kabhi", "Aap", "Dil",
            "Pyar", "Mohabbat", "Dost", "Yaar", "Zindagi", "Khwab", "Aasman"
        ],
        "titles": [
            "Dil", "Mohabbat", "Ishq", "Pyar", "Dosti", "Yaari", "Wafa",
            "Dard", "Khushi", "Gham", "Hasina", "Raja", "Rani", "Beta",
            "Bhai", "Didi", "Maa", "Abba", "Dunya", "Dil", "Jigar",
            "Roop", "Rang", "Raat", "Din", "Yeh", "Woh", "Tum", "Main",
            "Jaan", "Sajan", "Pyar", "Ishq", "Dilbar", "Mehboob"
        ]
    }
}

# Overview templates by genre
OVERVIEW_TEMPLATES = {
    "Action": [
        "A hero must save the world from imminent destruction using their extraordinary skills.",
        "An elite warrior embarks on a dangerous mission to stop a global threat.",
        "A former soldier returns to action to protect those he loves from danger.",
        "A skilled fighter must overcome impossible odds to achieve victory."
    ],
    "Romance": [
        "Two strangers find love in the most unexpected circumstances.",
        "A passionate love story that transcends all boundaries and obstacles.",
        "Two hearts destined to be together face challenges that test their bond.",
        "A tale of love, loss, and the power of true connection."
    ],
    "Drama": [
        "A compelling story about human relationships and life's complexities.",
        "An emotional journey through the trials and triumphs of the human spirit.",
        "A powerful narrative that explores themes of love, sacrifice, and redemption.",
        "A moving story that delves deep into the human condition."
    ],
    "Comedy": [
        "A hilarious adventure filled with laughter and unexpected twists.",
        "A group of friends find themselves in the most comical situations.",
        "A lighthearted story that brings joy and entertainment to all.",
        "A fun-filled journey with unforgettable characters and humorous moments."
    ],
    "Thriller": [
        "A suspenseful tale of mystery and danger that keeps you on the edge.",
        "A race against time to uncover the truth before it's too late.",
        "A gripping story of secrets, lies, and unexpected revelations.",
        "A tense narrative where nothing is as it seems."
    ],
    "Sci-Fi": [
        "A futuristic adventure that explores the boundaries of technology and humanity.",
        "A journey through time and space to save the future.",
        "An exploration of advanced technology and its impact on society.",
        "A story set in a world where science fiction becomes reality."
    ],
    "Horror": [
        "A terrifying journey into the unknown that will keep you awake.",
        "A spine-chilling tale of supernatural forces and dark secrets.",
        "A horror story that tests the limits of fear and survival.",
        "A dark narrative filled with suspense and terrifying moments."
    ],
    "Adventure": [
        "An epic journey to discover hidden treasures and ancient secrets.",
        "A thrilling expedition into uncharted territories filled with danger.",
        "An adventurous quest that leads to unexpected discoveries.",
        "A journey of a lifetime that changes everything."
    ]
}


def generate_movie_title(industry: str, industry_data: dict, movie_id: int) -> str:
    """Generate a realistic movie title based on industry patterns."""
    patterns = industry_data["name_patterns"]
    titles = industry_data["titles"]
    
    # Mix of patterns to create variety
    title_style = random.choice([1, 2, 3, 4])
    
    if title_style == 1:
        # Single word title
        return random.choice(titles)
    elif title_style == 2:
        # Two words
        return f"{random.choice(patterns)} {random.choice(titles)}"
    elif title_style == 3:
        # Pattern + Title
        return f"{random.choice(patterns)} {random.choice(titles)}"
    else:
        # Numbered or series-like
        return f"{random.choice(titles)} {random.randint(1, 5)}"


def generate_genres(industry_data: dict) -> str:
    """Generate 1-3 genres for a movie."""
    num_genres = random.choice([1, 2, 3])
    selected = random.sample(industry_data["genres"], min(num_genres, len(industry_data["genres"])))
    return " ".join(selected)


def generate_overview(genre: str) -> str:
    """Generate an overview based on the primary genre."""
    primary_genre = genre.split()[0] if genre else "Drama"
    
    if primary_genre in OVERVIEW_TEMPLATES:
        return random.choice(OVERVIEW_TEMPLATES[primary_genre])
    else:
        # Fallback
        templates = OVERVIEW_TEMPLATES.get("Drama", ["A compelling story that captivates audiences."])
        return random.choice(templates)


def generate_release_year() -> int:
    """Generate a release year between 1970 and 2024."""
    return random.randint(1970, 2024)


def generate_dataset(output_path: Path, num_movies: int = 15000):
    """Generate the complete movie dataset CSV file."""
    print(f"Generating {num_movies} movies dataset...")
    
    # Calculate distribution: 60% Hollywood, 30% Bollywood, 10% Lollywood
    num_hollywood = int(num_movies * 0.6)
    num_bollywood = int(num_movies * 0.3)
    num_lollywood = num_movies - num_hollywood - num_bollywood
    
    movies = []
    movie_id = 1
    
    # Generate Hollywood movies
    print(f"Generating {num_hollywood} Hollywood movies...")
    for _ in range(num_hollywood):
        industry_data = INDUSTRIES["Hollywood"]
        genre = generate_genres(industry_data)
        movies.append({
            "movie_id": movie_id,
            "title": generate_movie_title("Hollywood", industry_data, movie_id),
            "industry": "Hollywood",
            "genre": genre,
            "language": industry_data["language"],
            "release_year": generate_release_year(),
            "overview": generate_overview(genre)
        })
        movie_id += 1
    
    # Generate Bollywood movies
    print(f"Generating {num_bollywood} Bollywood movies...")
    for _ in range(num_bollywood):
        industry_data = INDUSTRIES["Bollywood"]
        genre = generate_genres(industry_data)
        movies.append({
            "movie_id": movie_id,
            "title": generate_movie_title("Bollywood", industry_data, movie_id),
            "industry": "Bollywood",
            "genre": genre,
            "language": industry_data["language"],
            "release_year": generate_release_year(),
            "overview": generate_overview(genre)
        })
        movie_id += 1
    
    # Generate Lollywood movies
    print(f"Generating {num_lollywood} Lollywood movies...")
    for _ in range(num_lollywood):
        industry_data = INDUSTRIES["Lollywood"]
        genre = generate_genres(industry_data)
        movies.append({
            "movie_id": movie_id,
            "title": generate_movie_title("Lollywood", industry_data, movie_id),
            "industry": "Lollywood",
            "genre": genre,
            "language": industry_data["language"],
            "release_year": generate_release_year(),
            "overview": generate_overview(genre)
        })
        movie_id += 1
    
    # Shuffle to mix industries
    random.shuffle(movies)
    
    # Write to CSV
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['movie_id', 'title', 'industry', 'genre', 'language', 'release_year', 'overview']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        writer.writerows(movies)
    
    print(f"✓ Dataset generated successfully at {output_path}")
    print(f"  Total movies: {len(movies)}")
    print(f"  Hollywood: {num_hollywood}, Bollywood: {num_bollywood}, Lollywood: {num_lollywood}")


if __name__ == "__main__":
    # Set random seed for reproducibility
    random.seed(42)
    
    # Generate dataset
    dataset_path = Path(__file__).parent.parent / "dataset" / "movies_15000.csv"
    generate_dataset(dataset_path, num_movies=15000)
    
    print("\nDataset generation complete!")

