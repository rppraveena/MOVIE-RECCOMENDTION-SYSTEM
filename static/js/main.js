// Global Variables
let currentMood = 'all';
let currentUser = null;
let searchTimeout = null;

// Initialize Home Page
function initializeHomePage() {
    // Load user data
    loadUserData();
    
    // Set time greeting
    setTimeGreeting();
    
    // Initialize mood buttons
    initializeMoodButtons();
    
    // Initialize taste profile
    initializeTasteProfile();
    
    // Load movies
    loadTrendingMovies();
    loadPersonalizedMovies();
    loadWatchlist();
    
    // Setup event listeners
    setupEventListeners();
    
    // Predict current mood
    predictCurrentMood();
    
    // Setup search
    setupSearch();
}

// Load user data from session
function loadUserData() {
    try {
        const userData = JSON.parse(localStorage.getItem('currentUser'));
        if (userData) {
            currentUser = userData;
            updateUserStats();
        }
    } catch (e) {
        console.error('Error loading user data:', e);
    }
}

// Update user statistics
function updateUserStats() {
    fetch('/api/user/stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const stats = data.stats;
                
                // Update watchlist count
                document.getElementById('watchlistCount').textContent = stats.watchlist_count;
                
                // Update mood badges
                updateMoodBadges(stats.top_moods);
                
                // Update mood accuracy
                const accuracy = Math.min(100, Math.floor(stats.moods_tracked * 10));
                document.getElementById('moodAccuracy').textContent = `${accuracy}%`;
                
                // Update learning progress
                const progress = Math.min(100, Math.floor(stats.moods_tracked * 15));
                document.getElementById('learningProgress').textContent = `${progress}%`;
                document.getElementById('progressText').textContent = `${progress}%`;
                document.getElementById('progressFill').style.width = `${progress}%`;
            }
        })
        .catch(error => console.error('Error fetching stats:', error));
}

// Update mood badges
function updateMoodBadges(moods) {
    const badgesContainer = document.getElementById('moodBadges');
    badgesContainer.innerHTML = '';
    
    const moodIcons = {
        'happy': 'fa-smile',
        'sad': 'fa-frown',
        'angry': 'fa-angry',
        'romantic': 'fa-heart',
        'adventurous': 'fa-hiking',
        'inspired': 'fa-lightbulb'
    };
    
    const moodColors = {
        'happy': 'happy',
        'sad': 'sad',
        'angry': 'angry',
        'romantic': 'romantic',
        'adventurous': 'adventurous',
        'inspired': 'inspired'
    };
    
    moods.forEach(moodData => {
        const mood = moodData.mood.toLowerCase();
        const count = moodData.count;
        
        const badge = document.createElement('div');
        badge.className = `badge ${moodColors[mood] || ''}`;
        badge.innerHTML = `
            <i class="fas ${moodIcons[mood] || 'fa-film'}"></i>
            ${mood.charAt(0).toUpperCase() + mood.slice(1)} Explorer (${count})
        `;
        badgesContainer.appendChild(badge);
    });
}

// Set time greeting
function setTimeGreeting() {
    const hour = new Date().getHours();
    let greeting = "Good ";
    
    if (hour < 12) greeting += "Morning";
    else if (hour < 18) greeting += "Afternoon";
    else greeting += "Evening";
    
    document.getElementById('timeGreeting').textContent = greeting;
}

// Initialize mood buttons
function initializeMoodButtons() {
    const moods = [
        {id: 'all', name: 'All', icon: 'fa-film', color: '#ffffff'},
        {id: 'happy', name: 'Happy', icon: 'fa-smile', color: '#4CAF50'},
        {id: 'sad', name: 'Sad', icon: 'fa-frown', color: '#2196F3'},
        {id: 'angry', name: 'Angry', icon: 'fa-angry', color: '#F44336'},
        {id: 'romantic', name: 'Romantic', icon: 'fa-heart', color: '#E91E63'},
        {id: 'adventurous', name: 'Adventurous', icon: 'fa-hiking', color: '#FFC107'},
        {id: 'inspired', name: 'Inspired', icon: 'fa-lightbulb', color: '#9C27B0'}
    ];
    
    const container = document.getElementById('moodButtons');
    container.innerHTML = '';
    
    moods.forEach(mood => {
        const button = document.createElement('button');
        button.className = `mood-btn ${mood.id === currentMood ? 'active' : ''}`;
        button.dataset.mood = mood.id;
        button.innerHTML = `
            <i class="fas ${mood.icon}"></i>
            ${mood.name}
        `;
        
        if (mood.id !== 'all') {
            button.style.borderColor = mood.color;
        }
        
        button.addEventListener('click', () => selectMood(mood.id));
        container.appendChild(button);
    });
}

// Select mood
function selectMood(mood) {
    currentMood = mood;
    
    // Update active button
    document.querySelectorAll('.mood-btn').forEach(btn => {
        if (btn.dataset.mood === mood) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update current mood display
    if (mood !== 'all') {
        const moodName = mood.charAt(0).toUpperCase() + mood.slice(1);
        document.getElementById('currentMood').textContent = moodName;
        document.querySelector('.mood-icon').textContent = getMoodEmoji(mood);
        
        // Load movies for this mood
        loadMoviesByMood(mood);
    }
}

function getMoodEmoji(mood) {
    const emojis = {
        happy: "😊",
        sad: "😢",
        angry: "😠",
        romantic: "❤️",
        adventurous: "🏔️",
        inspired: "💡"
    };
    return emojis[mood] || "🎬";
}

// Initialize taste profile
function initializeTasteProfile() {
    // Mood timeline
    const moodTimeline = document.getElementById('moodTimeline');
    moodTimeline.innerHTML = '';
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const moodValues = [75, 40, 60, 85, 90, 30, 80];
    
    days.forEach((day, index) => {
        const bar = document.createElement('div');
        bar.className = 'timeline-bar';
        bar.style.height = `${moodValues[index]}%`;
        bar.style.background = `linear-gradient(to top, var(--accent-2), ${getMoodColorForDay(index)})`;
        bar.title = `${day}: ${moodValues[index]}%`;
        moodTimeline.appendChild(bar);
    });
    
    // Genre chart
    const genreChart = document.getElementById('genreChart');
    genreChart.innerHTML = '';
    
    const genres = [
        {name: 'Drama', value: 8},
        {name: 'Action', value: 6},
        {name: 'Comedy', value: 5},
        {name: 'Romance', value: 4},
        {name: 'Sci-Fi', value: 3},
        {name: 'Thriller', value: 2}
    ];
    
    const maxValue = Math.max(...genres.map(g => g.value));
    
    genres.forEach(genre => {
        const percentage = (genre.value / maxValue) * 100;
        
        const item = document.createElement('div');
        item.className = 'genre-item';
        item.innerHTML = `
            <div class="genre-name">${genre.name}</div>
            <div class="genre-bar-container">
                <div class="genre-bar" style="width: ${percentage}%"></div>
            </div>
            <div class="genre-value">${genre.value}</div>
        `;
        genreChart.appendChild(item);
    });
}

function getMoodColorForDay(dayIndex) {
    const colors = [
        '#4CAF50', // Happy - green
        '#2196F3', // Sad - blue
        '#E91E63', // Romantic - pink
        '#9C27B0', // Inspired - purple
        '#FFC107', // Adventurous - yellow
        '#F44336', // Angry - red
        '#4CAF50'  // Happy - green
    ];
    return colors[dayIndex % colors.length];
}

// Load trending movies
function loadTrendingMovies() {
    fetch('/api/movies/trending')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayMovies(data.movies, 'trendingMovies');
            }
        })
        .catch(error => console.error('Error loading trending movies:', error));
}

// Load personalized movies
function loadPersonalizedMovies() {
    fetch('/api/movies/recommendations')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayMovies(data.recommendations, 'personalizedMovies');
                loadMoviesByMood(data.based_on || 'happy');
            }
        })
        .catch(error => console.error('Error loading personalized movies:', error));
}

// Load movies by mood
function loadMoviesByMood(mood) {
    fetch(`/api/movies/mood/${mood}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayMovies(data.movies, 'moodMovies');
            }
        })
        .catch(error => console.error('Error loading mood movies:', error));
}

// Load watchlist
function loadWatchlist() {
    fetch('/api/watchlist')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayMovies(data.watchlist.map(item => ({
                    id: item.movie_id,
                    title: item.movie_title,
                    poster_path: item.movie_poster,
                    rating: 0,
                    release_year: ''
                })), 'watchlistMovies');
            }
        })
        .catch(error => console.error('Error loading watchlist:', error));
}

// Display movies in grid
function displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    movies.slice(0, 6).forEach(movie => {
        const movieCard = createMovieCard(movie, containerId.includes('watchlist'));
        container.appendChild(movieCard);
    });
}

// Create movie card
function createMovieCard(movie, isWatchlist = false) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.id = movie.id;
    
    card.innerHTML = `
        <img src="${movie.poster_path || '/static/img/default-movie.jpg'}" alt="${movie.title}" class="movie-poster">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-meta">
                <span class="movie-year">${movie.release_year || ''}</span>
                ${movie.rating ? `<span class="movie-rating"><i class="fas fa-star"></i> ${movie.rating.toFixed(1)}</span>` : ''}
            </div>
            ${movie.overview ? `<p class="movie-overview">${movie.overview.substring(0, 100)}...</p>` : ''}
            <div class="movie-actions">
                <button class="action-btn trailer-btn" data-id="${movie.id}">
                    <i class="fas fa-play"></i> Trailer
                </button>
                <button class="action-btn watchlist-btn" data-id="${movie.id}">
                    <i class="fas ${isWatchlist ? 'fa-check' : 'fa-plus'}"></i> ${isWatchlist ? 'In Watchlist' : 'Watchlist'}
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.action-btn')) {
            window.location.href = `/movie/${movie.id}`;
        }
    });
    
    const trailerBtn = card.querySelector('.trailer-btn');
    trailerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showTrailer(movie.id);
    });
    
    const watchlistBtn = card.querySelector('.watchlist-btn');
    watchlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWatchlist(movie, watchlistBtn);
    });
    
    return card;
}

// Show trailer modal
function showTrailer(movieId) {
    fetch(`/api/movies/${movieId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.movie.trailer) {
                const trailerModal = document.getElementById('trailerModal');
                const trailerFrame = document.getElementById('trailerFrame');
                
                trailerFrame.src = `https://www.youtube.com/embed/${data.movie.trailer}?autoplay=1`;
                trailerModal.classList.add('active');
            } else {
                alert('Trailer not available for this movie.');
            }
        })
        .catch(error => {
            console.error('Error fetching trailer:', error);
            alert('Error loading trailer.');
        });
}

// Toggle watchlist
function toggleWatchlist(movie, button) {
    const isInWatchlist = button.querySelector('i').classList.contains('fa-check');
    
    if (isInWatchlist) {
        // Remove from watchlist
        fetch(`/api/watchlist/remove/${movie.id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                button.innerHTML = '<i class="fas fa-plus"></i> Watchlist';
                updateWatchlistCount(-1);
                showNotification(`"${movie.title}" removed from watchlist`);
                loadWatchlist(); // Refresh watchlist display
            }
        })
        .catch(error => console.error('Error removing from watchlist:', error));
    } else {
        // Add to watchlist
        fetch('/api/watchlist/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                movie_id: movie.id,
                movie_title: movie.title,
                movie_poster: movie.poster_path
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                button.innerHTML = '<i class="fas fa-check"></i> In Watchlist';
                updateWatchlistCount(1);
                showNotification(`"${movie.title}" added to watchlist`);
            }
        })
        .catch(error => console.error('Error adding to watchlist:', error));
    }
}

// Update watchlist count
function updateWatchlistCount(change) {
    const countElement = document.getElementById('watchlistCount');
    let currentCount = parseInt(countElement.textContent) || 0;
    currentCount += change;
    countElement.textContent = currentCount;
}

// Predict current mood based on time
function predictCurrentMood() {
    const hour = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    
    let predictedMood = 'happy'; // Default
    
    if (hour < 12) predictedMood = 'inspired'; // Morning
    else if (hour < 17) predictedMood = 'happy'; // Afternoon
    else if (hour < 21) predictedMood = 'romantic'; // Evening
    else predictedMood = 'sad'; // Night
    
    // Update display if no mood is selected
    if (currentMood === 'all') {
        const moodName = predictedMood.charAt(0).toUpperCase() + predictedMood.slice(1);
        document.getElementById('currentMood').textContent = moodName;
        document.querySelector('.mood-icon').textContent = getMoodEmoji(predictedMood);
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('mainSearch');
    const searchButton = document.getElementById('searchButton');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        
        const query = this.value.trim();
        if (query.length < 2) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        searchTimeout = setTimeout(() => {
            fetch(`/api/movies/search?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.results.length > 0) {
                        showSearchSuggestions(data.results, suggestionsContainer);
                    } else {
                        suggestionsContainer.innerHTML = '<div class="suggestion-item">No results found</div>';
                        suggestionsContainer.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Search error:', error);
                    suggestionsContainer.innerHTML = '<div class="suggestion-item">Error searching</div>';
                    suggestionsContainer.style.display = 'block';
                });
        }, 300);
    });
    
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

function showSearchSuggestions(movies, container) {
    container.innerHTML = '';
    
    movies.slice(0, 5).forEach(movie => {
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion-item';
        suggestion.innerHTML = `
            <img src="${movie.poster_path || '/static/img/default-movie.jpg'}" alt="${movie.title}">
            <div class="suggestion-info">
                <div class="suggestion-title">${movie.title}</div>
                <div class="suggestion-year">${movie.release_year || ''}</div>
            </div>
        `;
        
        suggestion.addEventListener('click', function() {
            window.location.href = `/movie/${movie.id}`;
        });
        
        container.appendChild(suggestion);
    });
    
    container.style.display = 'block';
}

function performSearch() {
    const query = document.getElementById('mainSearch').value.trim();
    if (query) {
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Start journey button
    document.getElementById('startJourneyBtn').addEventListener('click', function() {
        document.querySelector('.mood-selector').scrollIntoView({ behavior: 'smooth' });
        showNotification('Select a mood to find movies that match your vibe!');
    });
    
    // View all buttons
    document.querySelectorAll('.view-all').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.closest('.movie-section');
            const title = section.querySelector('h2').textContent;
            showNotification(`Viewing all ${title} movies`);
        });
    });
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
            
            // Stop trailer if playing
            const trailerFrame = document.getElementById('trailerFrame');
            if (trailerFrame) {
                trailerFrame.src = trailerFrame.src.replace('autoplay=1', 'autoplay=0');
            }
        });
    });
    
    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                
                // Stop trailer if playing
                const trailerFrame = document.getElementById('trailerFrame');
                if (trailerFrame) {
                    trailerFrame.src = trailerFrame.src.replace('autoplay=1', 'autoplay=0');
                }
            }
        });
    });
    
    // Profile dropdown
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            profileDropdown.classList.remove('show');
        });
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(90deg, #4CAF50, #2E7D32)' : 'linear-gradient(90deg, #F44336, #C62828)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);