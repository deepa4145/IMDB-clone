/* Get the DOM elements for toggle button, sidebar, flex-box, searchbar */

 const toggleButton = document.getElementById("toggle-sidebar");
 const flexBox = document.getElementById('left-panel');
 const searchBar = document.getElementById('search-bar');
 const sideBar = document.getElementById("sidebar");

 
/*Initialize the local storage items for favorite list */
const objectEle = "favMovieList";
 if (localStorage.getItem(objectEle) == null) {
    localStorage.setItem(objectEle, JSON.stringify([]));
}

document.addEventListener('load', ()=>{
    updateTaskCounter();
})
 
/* Update the task counter with the current number of items in the favorite list. */
function updateTaskCounter() {
    const favCounter = document.getElementById('total-count');
    const db = JSON.parse(localStorage.getItem(objectEle));
    if (favCounter.innerText != null) {
        favCounter.innerText = db.length;
    }
}


/*Check if an ID is in a list of favorites
 list- The list of favorites
 id- The ID to check*/

 function isFav(list, id) {
    let res = false;
    for (let i = 0; i < list.length; i++) {
        if (id == list[i]) {
            res = true;
        }
    }
    return res;
}
/* It will return truncated string greater then 50*/
  
function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

/* Function to toggle the sidebar and display the list of favorite movies.*/
 
toggleButton.addEventListener("click", function () {
    showFavMovieList();
    sideBar.classList.toggle("show");
    flexBox.classList.toggle('shrink');
});

flexBox.onscroll = function () {
    if (flexBox.scrollTop > searchBar.offsetTop) {
        searchBar.classList.add("fixed");
    } 
    else {
        searchBar.classList.remove("fixed");
         }
    };


/* Fetch movies from API, url - The base URL for the API, value - The value to append to the URL for filtering the results */

const fetchMoviesFromApi = async (url, value) => {
    const response = await fetch(`${url + value}`);
    const movies = await response.json();
    return movies;
}

/* showMovieList - function to show movie list based on search input.This function first retrieves the data from local storage and then it fetches the movies data from API 
 using the fetchMoviesFromApi function. It then maps over the movies data and creates the HTML template  for each movie. This HTML template is then added to the DOM.*/

async function showMovieList() {
    const list = JSON.parse(localStorage.getItem(objectEle));
    const inputValue = document.getElementById("search-input").value;
    const url = "https://www.omdbapi.com/?apikey=7b6b319d&s=";
    const moviesData = await fetchMoviesFromApi(url, inputValue);
    let html = '';
    if (moviesData.Search) {
        html = moviesData.Search.map(element => {

            return `
<div class="card">
            <div class="card-top"  onclick="showMovieDetails('${element.imdbID}', '${inputValue}')">
                <div class="movie-poster">
                <img src="${element.Poster=='N/A' ? 'lagaan.jpeg' :element.Poster }" alt="">
                </div>
                <div class="movieName">
                   ${element.Title}
                </div>
                <div class="movieYear">
                  ${element.Year}
                         <span class="button" onclick="showMovieDetails('${element.imdbID}', '${inputValue}')">Know More</span>
                    </div>
            </div>
            <div class="card-bottom">
                <div class="like">
                  <Strong> Add to Favoruite: </Strong>
                <i class="fa-solid fa-star ${isFav(list, element.imdbID) ? 'active' : ''} " onclick="addRemoveToFavList('${element.imdbID}')"></i>
                 </div>
                </div>
        </div>
            `
        }).join('');
        document.getElementById('card-holder').innerHTML = html;
    }
}



/*addRemoveToFavList - function to add or remove a movie from the favorite list
  The id of the movie to be added or removed
  This function first retrieves the data from local storage and then it checks if the provided movie id already exist in the favorite list.
  If it exists, it removes it from the list, otherwise it adds it to the list. It then updates the local storage*/

function addRemoveToFavList(id) {
    const PageLikeBtn = document.getElementById('like-button');
    let db = JSON.parse(localStorage.getItem(objectEle));
    console.log('before: ', db);
    let ifExist = false;
    for (let i = 0; i < db.length; i++) {
        if (id == db[i]) {
            ifExist = true;
            }
        }
     if (ifExist) {
        db.splice(db.indexOf(id), 1);
         }
    else {
        db.push(id);
    }

    localStorage.setItem(objectEle, JSON.stringify(db));
    if (PageLikeBtn != null) {
        PageLikeBtn.innerHTML = isFav(db, id) ? 'Remove From Favourite' : 'Add To Favourite';
    }
    console.log('After:',db);
    showMovieList();
    showFavMovieList();
    updateTaskCounter();
}

async function showMovieDetails(itemId, searchInput) {
    console.log("Searched Movie:", searchInput);
    const list = JSON.parse(localStorage.getItem(objectEle));
    flexBox.scrollTo({ top: 0, behavior: "smooth" });
    const url = "https://www.omdbapi.com/?apikey=7b6b319d&i=";
    const searchUrl = "https://www.omdbapi.com/?apikey=7b6b319d&s=";
    const movieList = await fetchMoviesFromApi(searchUrl,searchInput);
    console.log('Movieslist:',movieList);
    let html = ''
    const movieDetails = await fetchMoviesFromApi(url, itemId);
    if (movieDetails) {
        html = `
        <div class="container remove-top-margin">
            <div class="header hide">
                <div class="title">
                    </div>
            </div>
            <div class="fixed" id="search-bar">
                <div class="icon">
                    <i class="fa-solid fa-search "></i>
                </div>
                <div class="new-search-input">
                <form onkeyup="showMovieList()">
                <input id="search-input" type="text" "/>
                </form>
                </div>
                
            </div>
        </div>
        <div class="item-details">
        <div class="item-details-left">
        <img src="${movieDetails.Poster =='N/A' ? 'silence.jpg' : movieDetails.Poster}" alt="">
    </div>
    <div class="item-details-right">
        <div class="item-name">
            <strong>Movie Name: </strong>
            <span class="item-text">
            ${movieDetails.Title}
            </span>
         </div>
        <div class="movie-category">
            <strong>Genre: </strong>
            <span class="item-text">
            ${movieDetails.Genre}
            </span>
        </div>
        <div class="movie-info">
            <strong>Actors: </strong>
            <span class="item-text">
            ${movieDetails.Actors}
            </span>
        </div>

        <div class="movie-info">
        <strong>Directors: </strong>
        <span class="item-text">
        ${movieDetails.Director}
        </span>
    </div>
        <div class="movie-plot">
            <strong>Plot: </strong>
            <span class="item-text">
            ${movieDetails.Plot}
            </span>
        </div>
        <div class="movie-rating">
            <strong>Ratings: </strong>
            <span class="item-text"> 
            ${movieDetails.Ratings[0].Value}
          </span>
            <div id="like-button" onclick="addRemoveToFavList('${movieDetails.imdbID}')"> 
             ${isFav(list, movieDetails.imdbID) ? 'Remove From Favourite' : 'Add To Favourite'} </div>
        </div>
    </div>
</div> 
        <div class="card-name">
        Related Items
    </div>
    <div id="card-holder" class=" remove-top-margin ">`
    }
    if( movieList.Search){
        html += movieList.Search.map(element => {
            return ` <div class="card">
                <div class="card-top"  onclick="showMovieDetails('${element.imdbID}', '${searchInput}')">
                    <div class="movie-poster" >
                    <img src="${element.Poster=='N/A' ? 'maidaan.jpg' : element.Poster}" alt="">
                    </div>
                    <div class="movieName">
                        ${element.Title}
                    </div>
                    <div class="movieYear">
                        ${element.Year}
                        <span class="button" onclick="showMovieDetails('${element.imdbID}', '${searchInput}')">Know More</span>
                    </div>
                 </div>
                <div class="card-bottom">
             <div class="like">
                  <Span> Add to Favoruite: </Span>
                  <i class="fa-solid fa-star ${isFav(list, element.imdbID) ? 'active' : ''} " onclick="addRemoveToFavList('${element.imdbID}')"></i>
             </div>
                </div>
            </div>`
        }).join('');
    }

  
    html = html + '</div>';

    document.getElementById('left-panel').innerHTML = html;
}

/*
This function is used to show all the movies which are added to the favourite list.
html - This returns html which is used to show the favourite movies.
 If there is no favourite movie then it will show "Nothing To Show....."
showFavMovieList()
*/

async function showFavMovieList() {
    let FavList = JSON.parse(localStorage.getItem(objectEle));
    let url = "https://www.omdbapi.com/?apikey=7b6b319d&i=";
    let html = "";

    if (FavList.length == 0) {
        html = `<div class="fav-item nothing"> <h1> 
        Nothing To Show</h1> </div>`
    } else {
        for (let i = 0; i < FavList.length; i++) {
            const favmovieList = await fetchMoviesFromApi(url, FavList[i]);
            if (favmovieList) {
                let element = favmovieList;
                html += `
<div class="fav-item">
                <div class="fav-item-photo"  onclick="showMovieDetails('${element.imdbID}','arjun')">
                <img src="${element.Poster=='N/A' ? 'srikanth.jpg' : element.Poster}" alt="">
                </div>
                <div class="fav-item-details">
                         <div class="fav-item-name">
                                 
                        <span class="fav-item-text">
                        ${truncate(element.Title,20)}
                        </span>
                    </div>
                    <div id="fav-like-button" onclick="addRemoveToFavList('${element.imdbID}')">
                        Remove
                    </div>
            </div>
  </div> `
        }
        }
    }
    document.getElementById('fav').innerHTML = html;
}
updateTaskCounter();


