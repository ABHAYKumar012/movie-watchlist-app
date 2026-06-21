//let watchlist = [];
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []; // to store the watchlist in local storage

let currentPage = 1;
let currentSearch="";

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('resultsContainer');
const watchlistContainer = document.getElementById('watchlistContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

searchButton.addEventListener("click", () => {
        currentSearch = searchInput.value;
        currentPage = 1;
        searchMovies(currentSearch);
    });

//next button
nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage++;

    console.log("current page",currentPage);
    searchMovies(currentSearch);
})

// previous button
prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if(currentPage>1){
    currentPage--;
    searchMovies(currentSearch);
    }
})

async function searchMovies(movieName) {

    

    const apiKey = "74b9baaa";
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${movieName}&page=${currentPage}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);
    resultsContainer.innerHTML = "";

    if (data.Response === "True") {

        data.Search.forEach(movie => {

            const movieCard = document.createElement("div");
            
            movieCard.innerHTML = `
                            <img src="${movie.Poster}"
                             width="150"
                             onerror="this.src='images/no-image.png'">
                            <h3>${movie.Title}</h3>
                            <p>${movie.Year}</p>
                            <button>Add to Watchlist</button>
                        `;
            
            
            movieCard.addEventListener("click", async() => {

                const reponse= await fetch(`https://www.omdbapi.com/?apikey=74b9baaa&i=${movie.imdbID}`);

                const movieDetails = await reponse.json();
                console.log(movieDetails);
                
            
            });
            
            
            const addBtn = movieCard.querySelector("button");
            addBtn.addEventListener("click", () => {

                const alreadyAdded = watchlist.some(
                    item => item.imdbID === movie.imdbID
                );
                if(!alreadyAdded){
                watchlist.push(movie);
                localStorage.setItem(
                    "watchlist",
                    JSON.stringify(watchlist)
                );
                renderWatchlist();
                }
                //console.log(watchlist);
            })

            
            resultsContainer.appendChild(movieCard);            
                        

});

    }
}    

function renderWatchlist() {


    // clear the watchlist container
    watchlistContainer.innerHTML = "";
    // loop through the watchlist and create a card for each movie
    watchlist.forEach(movie => {

        const card = document.createElement("div");
    // crad display
        card.innerHTML = `
            <img src="${movie.Poster}" width="100" onerror="this.src='images/no-image.png'">
            <h4>${movie.Title}</h4>
            <button>Remove</button>
        `;
    // remove button
        const removeBtn = card.querySelector("button");

        removeBtn.addEventListener("click", () => {
            
            watchlist = watchlist.filter(
                item => item.imdbID !== movie.imdbID
            );

            localStorage.setItem(
                "watchlist",
                JSON.stringify(watchlist)

            );
            renderWatchlist();
        });



        watchlistContainer.appendChild(card);

    });
}
renderWatchlist();