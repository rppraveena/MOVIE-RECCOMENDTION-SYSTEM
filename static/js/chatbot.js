// static/js/chatbot.js

/**
 * CineBot - AI Movie Companion
 * Efficient and compatible chatbot for CineSoul
 */

class CineBot {
    constructor() {
        this.config = {
            TMDB_API_KEY: "5db7a6a7dbb93e9e885307f0f84fb0ef",
            TMDB_BASE_URL: "https://api.themoviedb.org/3",
            TMDB_IMAGE_BASE: "https://image.tmdb.org/t/p/w500",
            MAX_RESULTS: 5,
            TYPING_DELAY: 800 // ms
        };

        this.data = {
            moods: {
                'happy': [35, 10751],
                'sad': [18, 10749],
                'angry': [28, 53],
                'romantic': [10749],
                'adventurous': [12, 28],
                'inspired': [18, 36, 878],
                'horror': [27, 53],
                'all': []
            },
            
            actors: {
                'vijay': ['vijay devarakonda', 'vijay', 'devarakonda'],
                'ajith': ['ajith kumar', 'ajith'],
                'rajinikanth': ['rajinikanth', 'superstar'],
                'kamal': ['kamal haasan', 'kamal'],
                'prabhas': ['prabhas'],
                'tom cruise': ['tom cruise', 'tom', 'cruise'],
                'leonardo': ['leonardo dicaprio', 'leonardo', 'dicaprio'],
                'scarett': ['scarett johansson', 'scarett', 'johansson'],
                'vijay sethupathi': ['vijay sethupathi', 'sethupathi'],
                'dhanush': ['dhanush'],
                'suriya': ['suriya'],
                'vishal': ['vishal'],
                'samantha': ['samantha', 'samantha akkineni'],
                'nayanthara': ['nayanthara'],
                'trisha': ['trisha']
            },
            
            languages: {
                'tamil': 'ta',
                'hindi': 'hi',
                'telugu': 'te',
                'malayalam': 'ml',
                'kannada': 'kn',
                'english': 'en',
                'bengali': 'bn',
                'marathi': 'mr'
            },
            
            genres: {
                'action': 28,
                'comedy': 35,
                'drama': 18,
                'romance': 10749,
                'horror': 27,
                'thriller': 53,
                'sci-fi': 878,
                'adventure': 12,
                'fantasy': 14,
                'animation': 16,
                'crime': 80,
                'documentary': 99
            }
        };

        this.cache = new Map();
        this.isTyping = false;
        this.conversationHistory = [];
    }

    // ========== INITIALIZATION ==========
    init() {
        this.bindEvents();
        this.addWelcomeMessage();
    }

    bindEvents() {
        const toggleBtn = document.getElementById('chatbot-toggle');
        const chatbot = document.getElementById('chatbot-container');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');

        if (!toggleBtn || !chatbot) {
            console.warn('Chatbot elements not found');
            return;
        }

        // Toggle chatbot
        toggleBtn.addEventListener('click', () => this.toggleChatbot(chatbot));

        // Close chatbot
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                chatbot.style.display = 'none';
            });
        }

        // Send message
        if (sendBtn && input) {
            sendBtn.addEventListener('click', () => this.handleSendMessage(input));
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSendMessage(input);
            });
        }
    }

    toggleChatbot(chatbot) {
        const isVisible = chatbot.style.display === 'flex';
        chatbot.style.display = isVisible ? 'none' : 'flex';
        
        if (!isVisible) {
            this.addWelcomeMessage();
            document.getElementById('chatbot-input')?.focus();
        }
    }

    // ========== MESSAGE HANDLING ==========
    async handleSendMessage(input) {
        const message = input.value.trim();
        if (!message || this.isTyping) return;

        input.value = '';
        this.addUserMessage(message);
        this.conversationHistory.push({ type: 'user', message });

        await this.processMessage(message);
    }

    async processMessage(message) {
        this.showTypingIndicator();
        
        try {
            const response = await this.getResponse(message);
            await this.delayedResponse(response);
        } catch (error) {
            console.error('Error processing message:', error);
            this.addBotMessage("Sorry, I encountered an error. Please try again.");
        } finally {
            this.hideTypingIndicator();
        }
    }

    async delayedResponse(response) {
        return new Promise(resolve => {
            setTimeout(() => {
                this.addBotMessage(response);
                this.conversationHistory.push({ type: 'bot', message: response });
                resolve();
            }, this.config.TYPING_DELAY);
        });
    }

    // ========== MESSAGE DISPLAY ==========
    addUserMessage(message) {
        this.addMessage(message, 'user-message');
    }

    addBotMessage(message) {
        this.addMessage(message, 'bot-message');
    }

    addMessage(content, className) {
        const container = document.getElementById('chatbot-messages');
        if (!container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${className}`;
        
        if (className === 'bot-message') {
            msgDiv.innerHTML = content;
        } else {
            msgDiv.textContent = content;
        }

        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    addWelcomeMessage() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer || messagesContainer.children.length > 0) return;

        const welcomeMessage = `
            Hello! I'm CineBot 🎬<br><br>
            I can help you with:<br>
            • <strong>Mood-based recommendations</strong> (happy, sad, horror, romantic)<br>
            • <strong>Actor movies</strong> (Vijay, Ajith, Tom Cruise)<br>
            • <strong>Language movies</strong> (Tamil, Hindi, Telugu)<br>
            • <strong>Specific searches</strong> (romantic movies 2017)<br>
            • <strong>TV shows</strong> (popular series)<br>
            • <strong>Your watchlist</strong> and <strong>trending</strong> movies<br><br>
            Try asking: "Tamil Vijay movies" or "horror movies from 2020"
        `;

        this.addBotMessage(welcomeMessage);
    }

    // ========== TYPING INDICATOR ==========
    showTypingIndicator() {
        this.isTyping = true;
        const container = document.getElementById('chatbot-messages');
        if (!container) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) typingDiv.remove();
    }

    // ========== QUERY PROCESSING ==========
    async getResponse(message) {
        const query = this.parseQuery(message.toLowerCase());
        
        // Check cache first
        const cacheKey = JSON.stringify(query);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        let response;
        
        // Route to appropriate handler
        if (query.hasYear && (query.mood || query.language || query.genre)) {
            response = await this.handleComplexQuery(query);
        } else if (query.mood) {
            response = await this.handleMoodQuery(query.mood);
        } else if (query.actor) {
            response = await this.handleActorQuery(query.actor);
        } else if (query.language) {
            response = await this.handleLanguageQuery(query.language);
        } else if (query.genre) {
            response = await this.handleGenreQuery(query.genre);
        } else if (query.isWatchlist) {
            response = await this.handleWatchlistQuery();
        } else if (query.isTrending) {
            response = await this.handleTrendingQuery();
        } else if (query.isNew) {
            response = await this.handleNewReleasesQuery();
        } else if (query.isTV) {
            response = await this.handleTVShowQuery(query);
        } else if (query.searchTerm) {
            response = await this.handleSearchQuery(query.searchTerm);
        } else {
            response = this.getHelpResponse();
        }

        // Cache the response
        if (response) {
            this.cache.set(cacheKey, response);
        }

        return response || "I couldn't find what you're looking for. Try asking differently!";
    }

    parseQuery(message) {
        const query = {
            mood: null,
            actor: null,
            language: null,
            genre: null,
            year: null,
            hasYear: false,
            searchTerm: null,
            isWatchlist: false,
            isTrending: false,
            isNew: false,
            isTV: false
        };

        // Extract year
        const yearMatch = message.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
            query.year = yearMatch[0];
            query.hasYear = true;
        }

        // Check for mood
        for (const [mood, genreIds] of Object.entries(this.data.moods)) {
            if (mood !== 'all' && message.includes(mood)) {
                query.mood = mood;
                break;
            }
        }

        // Check for actor
        for (const [actor, keywords] of Object.entries(this.data.actors)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                query.actor = actor;
                break;
            }
        }

        // Check for language
        for (const [language, code] of Object.entries(this.data.languages)) {
            if (message.includes(language)) {
                query.language = language;
                break;
            }
        }

        // Check for genre
        for (const [genre, id] of Object.entries(this.data.genres)) {
            if (message.includes(genre)) {
                query.genre = genre;
                break;
            }
        }

        // Check for special keywords
        if (message.includes('watchlist') || message.includes('my list')) {
            query.isWatchlist = true;
        } else if (message.includes('trending') || message.includes('popular')) {
            query.isTrending = true;
        } else if (message.includes('new') || message.includes('latest')) {
            query.isNew = true;
        } else if (message.includes('tv') || message.includes('series') || message.includes('show')) {
            query.isTV = true;
        }

        // Extract search term (if no specific query found)
        if (!query.mood && !query.actor && !query.language && !query.genre && 
            !query.isWatchlist && !query.isTrending && !query.isNew && !query.isTV) {
            query.searchTerm = message;
        }

        return query;
    }

    // ========== API HELPERS ==========
    async fetchAPI(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    async searchMovies(params = {}) {
        let url = `${this.config.TMDB_BASE_URL}/discover/movie?api_key=${this.config.TMDB_API_KEY}&sort_by=popularity.desc&page=1`;
        
        // Add filters
        if (params.genreIds && params.genreIds.length > 0) {
            url += `&with_genres=${params.genreIds.join(',')}`;
        }
        if (params.year) {
            url += `&primary_release_year=${params.year}`;
        }
        if (params.language) {
            const langCode = this.data.languages[params.language];
            if (langCode) {
                url += `&with_original_language=${langCode}`;
            }
        }

        const data = await this.fetchAPI(url);
        return data?.results || [];
    }

    async searchActorMovies(actorName) {
        // First search for actor
        const searchUrl = `${this.config.TMDB_BASE_URL}/search/person?api_key=${this.config.TMDB_API_KEY}&query=${encodeURIComponent(actorName)}`;
        const searchData = await this.fetchAPI(searchUrl);
        
        if (!searchData?.results?.[0]) return [];
        
        const actorId = searchData.results[0].id;
        const moviesUrl = `${this.config.TMDB_BASE_URL}/person/${actorId}/movie_credits?api_key=${this.config.TMDB_API_KEY}`;
        const moviesData = await this.fetchAPI(moviesUrl);
        
        return moviesData?.cast || [];
    }

    async searchTVShows(params = {}) {
        let url = `${this.config.TMDB_BASE_URL}/discover/tv?api_key=${this.config.TMDB_API_KEY}&sort_by=popularity.desc&page=1`;
        
        if (params.genreId) {
            url += `&with_genres=${params.genreId}`;
        }

        const data = await this.fetchAPI(url);
        return data?.results || [];
    }

    // ========== RESPONSE BUILDERS ==========
    buildMovieList(movies, title) {
        if (!movies || movies.length === 0) {
            return `No movies found for "${title}". Try a different search!`;
        }

        let result = `${title}:<br>`;
        
        movies.slice(0, this.config.MAX_RESULTS).forEach(movie => {
            const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
            result += `
                <div class="movie-suggestion" onclick="window.location.href='/movie-details?id=${movie.id}'">
                    <strong>${movie.title || movie.name}</strong> (${year}) - ⭐ ${rating}
                </div>
            `;
        });

        if (movies.length > this.config.MAX_RESULTS) {
            result += `<br><em>Showing ${this.config.MAX_RESULTS} of ${movies.length} results</em>`;
        }

        return result;
    }

    // ========== QUERY HANDLERS ==========
    async handleMoodQuery(mood) {
        const genreIds = this.data.moods[mood] || [];
        const movies = await this.searchMovies({ genreIds });
        
        if (movies.length === 0) {
            return `No ${mood} movies found. Try selecting the "${mood}" mood above!`;
        }

        const response = this.buildMovieList(movies, `${mood.charAt(0).toUpperCase() + mood.slice(1)} movies`);
        response += `<br><a href="#" onclick="document.querySelector('.mood-btn[data-mood=\"${mood}\"]').click(); return false;" style="color: #05d9e8;">Browse more ${mood} movies</a>`;
        
        return response;
    }

    async handleActorQuery(actorName) {
        const movies = await this.searchActorMovies(actorName);
        
        if (movies.length === 0) {
            return `No movies found for ${actorName}. Try searching in the search bar!`;
        }

        const response = this.buildMovieList(movies, `Movies featuring ${actorName}`);
        response += `<br><a href="/search-results?q=${encodeURIComponent(actorName)}&type=actor" style="color: #05d9e8;">See all ${movies.length} movies</a>`;
        
        return response;
    }

    async handleLanguageQuery(language) {
        const movies = await this.searchMovies({ language });
        
        if (movies.length === 0) {
            return `No ${language} movies found. Try a different language!`;
        }

        const response = this.buildMovieList(movies, `${language.charAt(0).toUpperCase() + language.slice(1)} movies`);
        response += `<br><a href="/search-results?q=${language}&type=language" style="color: #05d9e8;">Browse more ${language} movies</a>`;
        
        return response;
    }

    async handleGenreQuery(genre) {
        const genreId = this.data.genres[genre];
        if (!genreId) return `I don't have data for ${genre} genre.`;

        const movies = await this.searchMovies({ genreIds: [genreId] });
        
        if (movies.length === 0) {
            return `No ${genre} movies found.`;
        }

        const response = this.buildMovieList(movies, `${genre.charAt(0).toUpperCase() + genre.slice(1)} movies`);
        response += `<br><a href="/search-results?q=${genre}&type=genre" style="color: #05d9e8;">Browse more ${genre} movies</a>`;
        
        return response;
    }

    async handleComplexQuery(query) {
        const params = {
            genreIds: [],
            year: query.year,
            language: query.language
        };

        // Add mood genres
        if (query.mood) {
            params.genreIds = [...params.genreIds, ...(this.data.moods[query.mood] || [])];
        }

        // Add specific genre
        if (query.genre) {
            const genreId = this.data.genres[query.genre];
            if (genreId) {
                params.genreIds.push(genreId);
            }
        }

        // Remove duplicates
        params.genreIds = [...new Set(params.genreIds)];

        const movies = await this.searchMovies(params);
        
        if (movies.length === 0) {
            return "No movies found matching all your criteria. Try broadening your search!";
        }

        // Build query description
        let description = [];
        if (query.mood) description.push(query.mood);
        if (query.language) description.push(query.language);
        if (query.genre) description.push(query.genre);
        if (query.year) description.push(query.year);

        const title = description.join(' ').charAt(0).toUpperCase() + description.join(' ').slice(1) + ' movies';
        
        const response = this.buildMovieList(movies, title);
        
        // Create search link
        const searchParams = new URLSearchParams();
        if (query.mood) searchParams.append('mood', query.mood);
        if (query.language) searchParams.append('language', query.language);
        if (query.genre) searchParams.append('genre', query.genre);
        if (query.year) searchParams.append('year', query.year);
        
        response += `<br><a href="/search-results?${searchParams.toString()}" style="color: #05d9e8;">Browse all results</a>`;
        
        return response;
    }

    async handleSearchQuery(searchTerm) {
        const url = `${this.config.TMDB_BASE_URL}/search/movie?api_key=${this.config.TMDB_API_KEY}&query=${encodeURIComponent(searchTerm)}`;
        const data = await this.fetchAPI(url);
        const movies = data?.results || [];
        
        if (movies.length === 0) {
            return `No results found for "${searchTerm}". Try different keywords!`;
        }

        const response = this.buildMovieList(movies, `Results for "${searchTerm}"`);
        
        if (movies.length > this.config.MAX_RESULTS) {
            response += `<br><a href="/search-results?q=${encodeURIComponent(searchTerm)}" style="color: #05d9e8;">See all ${movies.length} results</a>`;
        }
        
        return response;
    }

    async handleTVShowQuery(query) {
        let params = {};
        
        if (query.genre) {
            const genreId = this.data.genres[query.genre];
            if (genreId) params.genreId = genreId;
        }

        const shows = await this.searchTVShows(params);
        
        if (shows.length === 0) {
            return "No TV shows found. Check the TV Shows section above!";
        }

        let title = "Popular TV Shows";
        if (query.genre) {
            title = `${query.genre.charAt(0).toUpperCase() + query.genre.slice(1)} TV Shows`;
        }

        const response = this.buildMovieList(shows, title);
        return response;
    }

    async handleWatchlistQuery() {
        // Check if watchlist exists in global scope
        if (typeof watchlist === 'undefined' || !Array.isArray(watchlist) || watchlist.length === 0) {
            return "Your watchlist is empty! Add movies by clicking the bookmark icon on any movie.";
        }

        let result = "Your watchlist:<br>";
        
        watchlist.slice(0, this.config.MAX_RESULTS).forEach((movie, index) => {
            result += `
                <div class="movie-suggestion" onclick="window.location.href='/movie-details?id=${movie.id}'">
                    <strong>${movie.title}</strong> (${movie.year}) - ⭐ ${movie.rating}
                </div>
            `;
        });

        if (watchlist.length > this.config.MAX_RESULTS) {
            result += `<br>You have ${watchlist.length} movies in your watchlist.`;
        }

        return result;
    }

    async handleTrendingQuery() {
        const url = `${this.config.TMDB_BASE_URL}/trending/movie/week?api_key=${this.config.TMDB_API_KEY}`;
        const data = await this.fetchAPI(url);
        const movies = data?.results || [];
        
        if (movies.length === 0) {
            return "Couldn't fetch trending movies. Check the Trending section above!";
        }

        const response = this.buildMovieList(movies.slice(0, 3), "Trending now");
        response += `<br>Check the "Trending Now" section above for more!`;
        
        return response;
    }

    async handleNewReleasesQuery() {
        const currentYear = new Date().getFullYear();
        const movies = await this.searchMovies({ year: currentYear });
        
        if (movies.length === 0) {
            return "Couldn't fetch new releases. Check the New Releases section above!";
        }

        const response = this.buildMovieList(movies.slice(0, 3), "New releases");
        response += `<br>Check the "New Releases" section above for more!`;
        
        return response;
    }

    getHelpResponse() {
        return `
            I can help you find movies! Try asking:<br><br>
            <strong>Moods:</strong> "happy movies", "horror", "romantic"<br>
            <strong>Actors:</strong> "Vijay movies", "Tom Cruise action"<br>
            <strong>Languages:</strong> "Tamil movies", "Hindi comedy"<br>
            <strong>Specific:</strong> "romantic movies 2017", "Tamil horror 2020"<br>
            <strong>Other:</strong> "my watchlist", "trending", "new movies", "TV shows"
        `;
    }
}

// ========== GLOBAL INITIALIZATION ==========
let cineBot;

document.addEventListener('DOMContentLoaded', function() {
    // Check if chatbot elements exist
    if (document.getElementById('chatbot-toggle') && document.getElementById('chatbot-container')) {
        cineBot = new CineBot();
        cineBot.init();
    }
});

// Global function for external calls (if needed)
window.CineBot = {
    sendMessage: async function(message) {
        if (!cineBot) return;
        return await cineBot.getResponse(message);
    },
    
    toggle: function() {
        const chatbot = document.getElementById('chatbot-container');
        if (chatbot && cineBot) {
            cineBot.toggleChatbot(chatbot);
        }
    }
};