const filmList = document.getElementById('films');
const imgHolder = document.querySelector("img");
const movieTitle =document.getElementById("title");
const movieRuntime = document.getElementById("runtime");
const movieDescription = document.getElementById("film-info");
const url = "http://localhost:3000/films";
const btn = document.getElementById("buy-ticket");
const showTime = document.getElementById("showtime");
const initialTickets = document.getElementById("ticket-num")

// Eevent listener to add the DOM Content usinf 'Fetch Url'

document.addEventListener("DOMContentLoaded", () => {
    fetch(url)
    .then((response) => {
        if (!response.ok) {
            console.log("problem")
            return 
        }
        //console.log(response.json)
        return response.json()
    })
    .then((data) => {
            
        console.log(data);
        
        //Return a list of movie titles
        renderMovies(data);

        //render first movies information by default
        const firstMovie = data[0];
        moviePoster(firstMovie);   
    
    })
    .catch((error) => {
        console.log("Fetch error:" ,error);
    })
    function renderMovies(data){
        const movieObj = data.map(movie => {
            const container = document.createElement("div")
            const li = document.createElement("list");

            //Add a delete button next to the movie  name for deleting
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "Delete";
            container.appendChild(deleteBtn);
            deleteBtn.addEventListener('click', (e) => {
                //e.preventDefault();
                removeMovie(movie);
                console.log(movie.id)
            })
            //Create and populate li elements for movie titles
            li.setAttribute("class", "film item")
            li.innerHTML = movie.title;
            li.appendChild(container);
            //Add event listener to show movie poster for the clicked movie title instead of default first movie
            li.addEventListener('click', () => {
                let showingMovie = movie;
                moviePoster(showingMovie);
            })
            filmList.appendChild(li); //Populate html element with the created lists
        })
    }
     function removeMovie(movie){
        console.log(movie);
        fetch(`url/${movie.id}`, {
            method: "DELETE",
        })
        .then((res) => {
            if(!res.ok){
                throw new Error("Error occured");
            }
            return res.json();
        })
        .then((data) => {

            const index = data.findIndex((m) => {
                m.id === movie.id;
                return m.id;
            })
            if(index !== 1){
                data.splice(index, 1);
            }
        })
        .catch((error) => {
            console.log("Delete error:" ,error);
        })
     }

     //Description of each and every movie

     function moviePoster(currentMovie) {
        showTime.innerHTML = `ShowTime: ${currentMovie.showtime}`
        movieTitle.innerHTML = currentMovie.title;
        movieDescription.innerHTML = currentMovie.description;
        movieRuntime.innerHTML = `Runtime: ${currentMovie.runtime} minute`;
        imgHolder.src = currentMovie.poster;
        initialTickets.innerHTML = currentMovie.capacity - currentMovie.tickets_sold;

        //toggle button attribute disabled true text content remove att
        btn.setAttribute("disabled", "true");

        //Button that updates the available number of tickets 
        if (currentMovie.tickets_sold >= currentMovie.capacity) {
            btn.textContent = "Sold Out";
            btn.setAttribute("disabled", "true");
        } else {
            btn.textContent = "Buy Ticket";
            btn.removeAttribute("disabled");
        }
        btn.addEventListener("click", (e) => {
            e.preventDefault();

           // firstMovie.tickets_sold -=1;
            //console.log(initialTickets);
            buyTicket(currentMovie);
            
        });
     }

     function buyTicket(currentMovie) {
        if (currentMovie) {

            // Check if there are available tickets

            if (currentMovie.tickets_sold < currentMovie.capacity) {
                // Update the total number of tickets sold

                currentMovie.tickets_sold++;
                updateTickets(currentMovie);
            }
        }
    }
    // Update of the number of tickets
    
    function updateTickets(movie){

        if(movie) {
            fetch(`url/${movie.id}`, {
                method: "PATCH",
                headers: {
                    'content-Type': 'application/JSON',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(movie)
            })
            .then((res) => res.json)
            .then((updatedData) => {
                movie = updatedData;
            })
            .catch((error) => {
                console.log(`Patch Error: ${error}`);
            })
        }  
    }

})