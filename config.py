# config.py - UPDATED WITH CORRECT PASSWORD

class Config:
    # TMDB API
    TMDB_API_KEY = "5db7a6a7dbb93e9e885307f0f84fb0ef"
    TMDB_BASE_URL = "https://api.themoviedb.org/3"
    
    # OMDb API
    OMDB_API_KEY = "b028aaed"
    OMDB_BASE_URL = "http://www.omdbapi.com/"
    
    # YouTube API
    YOUTUBE_API_KEY = "AIzaSyAZS_pAWSyImH63eJ1vK8hwlu12KppD0c4"
    
    # Database Configuration - CORRECT PASSWORD
    DB_CONFIG = {
        'host': 'localhost',
        'user': 'root',
        'password': 'pravv',  # Your correct password
        'database': 'cinesoul',
        'port': 3306,
        'auth_plugin': 'mysql_native_password'
    }
    
    # Flask Secret Key
    SECRET_KEY = 'cinesoul-secret-key-2025-movie-app'
    
    # Image Base URL
    TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"
    TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/original"