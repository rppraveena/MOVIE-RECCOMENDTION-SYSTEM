<p align="center">
  <img src="assets/banner.png" alt="CineSoul Banner" width="100%">
</p>

<h1 align="center">CineSoul – Intelligent Movie Recommendation Platform</h1>

<p align="center">
  A Flask-based movie recommendation platform featuring mood-based recommendations, intelligent search, AI chatbot assistance, and trailer integration.
</p>
# CineSoul – Intelligent Movie Recommendation Platform

CineSoul is a Flask-based web application that helps users discover movies through mood-based recommendations, intelligent search, and an AI-powered chatbot. By integrating multiple movie databases and trailer services, the platform delivers a personalized movie discovery experience with a clean and user-friendly interface.

---

## Overview

Finding the right movie to watch can be overwhelming due to the vast number of choices available across streaming platforms. CineSoul simplifies this process by allowing users to receive personalized recommendations based on their mood, search for detailed movie information, watch trailers, and interact with a chatbot for movie suggestions.

---

## Key Features

### User Authentication
- User registration and login
- Secure session management
- Personalized experience for every user

### Mood-Based Movie Recommendations
- Select a mood such as Happy, Sad, Romantic, or Thrilling
- Movies are recommended by mapping moods to relevant genres
- Recommendations are fetched dynamically using movie APIs

### Intelligent Movie Search
- Search movies by title
- View detailed movie information
- Access ratings, genres, cast, and overview

### AI Chatbot Assistant
- Accepts natural language movie requests
- Suggests movies based on user preferences
- Provides direct navigation to recommended movies

### Movie Details
- Poster
- Plot summary
- Ratings
- Genres
- Cast information
- Release date

### Trailer Integration
- Watch official movie trailers through YouTube integration

---

## System Workflow

```text
User
   │
   ▼
Flask Web Application
   │
   ├── Authentication Module
   ├── Mood Recommendation Module
   ├── Search Module
   ├── Chatbot Module
   │
   ▼
External APIs
   ├── TMDB API
   ├── OMDb API
   └── YouTube API
```

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Backend | Python, Flask |
| Frontend | HTML, CSS, JavaScript |
| Database | MySQL |
| APIs | TMDB API, OMDb API, YouTube API |
| Authentication | Flask Sessions |
| Deployment | GitHub |

---

## APIs Used

### TMDB API
- Movie metadata
- Genres
- Posters
- Ratings
- Cast information

### OMDb API
- Additional movie information
- Extended metadata

### YouTube API
- Official movie trailers

---

## Project Structure

```text
movie-recommendation-engine/
│
├── assets/
├── static/
├── templates/
├── app.py
├── config.py
├── requirements.txt
├── setup.py
└── README.md
```

---

## Screenshots

### Welcome Page
![Welcome](assets/welcome.png)

### Login
![Login](assets/login.png)

### Signup
![Signup](assets/signup.png)

### Home
![Home](assets/home.png)

### Search Results
![Search](assets/search-results.png)

### Movie Details
![Movie Details](assets/movie-details.png)

### AI Chatbot
![Chatbot](assets/chatbot.png)

---

## Installation

Clone the repository
```bash
git clone https://github.com/rppraveena/movie-recommendation-engine.git
```

Navigate to the project
```bash
cd movie-recommendation-engine
```

Install dependencies
```bash
pip install -r requirements.txt
```

Configure your API keys and database settings.

Run the application
```bash
python app.py
```

---

## Future Enhancements
- Personalized recommendations using watch history
- Movie bookmarking and favorites
- User reviews and ratings
- Recommendation history
- Streaming platform availability
- Advanced filtering and sorting

---

## Author

**Praveena R**
B.E.(CSE)
GitHub: https://github.com/rppraveena
