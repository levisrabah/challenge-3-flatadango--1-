document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = 'http://localhost:3000';
    const movieListContainer = document.getElementById('films');
    const movieDetailsContainer = document.getElementById('showing');
  
    // Function to update movie details
  function updateMovieDetails(movie) {
    document.getElementById('poster').src = movie.poster;
    document.getElementById('title').textContent = movie.title;
    document.getElementById('runtime').textContent = `${movie.runtime} minutes`;
    document.getElementById('film-info').textContent = movie.description;
    document.getElementById('showtime').textContent = movie.showtime;
    const availableTicketsSpan = document.getElementById('ticket-num');
    const availableTickets = movie.capacity - movie.tickets_sold;
    availableTicketsSpan.textContent = availableTickets;
    
    const buyTicketButton = document.getElementById('buy-ticket');
    if (availableTickets > 0) {
      buyTicketButton.textContent = 'Buy Ticket';
      buyTicketButton.disabled = false;
  }
  else {
    buyTicketButton.textContent = 'Sold Out';
    buyTicketButton.disabled = true;
   }
  }
    
  
  // Function to populate movie list
  function populateMovieList(movies) {
    movieListContainer.innerHTML = ''; // Clear existing list
  
    movies.forEach(movie => {
      const listItem = document.createElement('li');
      listItem.classList.add('film', 'item');
      listItem.textContent = movie.title;
  
   // Add delete button
     const deleteButton = document.createElement('button');
     deleteButton.textContent = 'Delete';
     deleteButton.classList.add('delete-button');
     deleteButton.onclick = () => deleteMovie(movie.id);
     listItem.appendChild(deleteButton);
  
  // Function to handle deleting a movie
  async function deleteMovie(movieId) {
    const confirmDelete = confirm('Hi! Do you really want to delete this movie?');
  
    if (confirmDelete) {
    try {
      const response = await fetch(`${baseUrl}/films/${movieId}`, { method: 'DELETE' });
  
      if (response.ok) {
    // Remove movie from list
      const movieItem = document.querySelector(`#films li[data-id="${movieId}"]`);
        if (movieItem) {
          movieItem.remove();
         } 
    else {
              alert('The movie isn/t in the list of movies.');
          }
        } else {
          throw new Error('Failed to delete movie.');
        }
      } catch (error) {
        console.error('Error deleting movie:', error);
        alert('An error occurred while deleting the movie. Please try again later.');
      }
    }
  }
  
  
        listItem.addEventListener('click', () => {
          // Update movie details based on the clicked movie
          updateMovieDetails(movie);
          // Enable buy ticket button
          const buyTicketButton = document.getElementById('buy-ticket');
          buyTicketButton.disabled = false;
          buyTicketButton.textContent = 'Buy Ticket';
          // Set buy ticket button click event listener
          buyTicketButton.onclick = () => buyTicket(movie.id);
        });
  
        movieListContainer.appendChild(listItem);
      });
    }
  
    // Function to handle buying a ticket
    async function buyTicket(movieId) {
      const response = await fetch(`${baseUrl}/films/${movieId}`);
      const movie = await response.json();
  
      if (movie.capacity - movie.tickets_sold > 0) {
        const updatedTicketsSold = movie.tickets_sold + 1;
  
        // Update tickets_sold on server
        await fetch(`${baseUrl}/films/${movieId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
        });
  
        // Update ticket count on frontend
        movie.tickets_sold = updatedTicketsSold;
        document.getElementById('ticket-num').textContent = movie.capacity - movie.tickets_sold;
  
        // Check if movie is sold out
        if (updatedTicketsSold === movie.capacity) {
          const buyTicketButton = document.getElementById('buy-ticket');
          buyTicketButton.textContent = 'Sold Out';
          buyTicketButton.disabled = true;
        }
  
      } else {
        alert('Sorry, this movie is sold out!');
      }
    }
  
    // Load initial page
    async function initialize() {
      const allMoviesResponse = await fetch(`${baseUrl}/films`);
      const allMovies = await allMoviesResponse.json();
      populateMovieList(allMovies);
    }
  
    // Initialize the page
    initialize();
  });

