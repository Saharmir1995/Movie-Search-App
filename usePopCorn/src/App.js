import { useEffect, useState } from 'react';
import './App.css';


const tempMovieData = [
  {
    imdbID: "tt0848228",
    Title: "The Avengers",
    Year: 2012,
    poster: "https://th.bing.com/th/id/OIP.iAsDFqwmY2RZZVAt9kiojwHaLH?w=124&h=186&c=7&r=0&o=5&pid=1.7",
  },

  {
    imdbID: "tt4154796",
    Title: "Avengers: Endgame",
    Year: 2019,
    poster: "https://th.bing.com/th/id/OIP.JlsO4zNkfARnki4dulvmbwHaK-?w=115&h=180&c=7&r=0&o=5&pid=1.7",
  },
  {
    imdbID: "tt0137523",
    Title: "Fight Club",
    Year: 1999,
    poster: "https://th.bing.com/th/id/OIP.X8GXwUnJEzAclGg3OtAnrAHaLH?w=119&h=180&c=7&r=0&o=5&pid=1.7",
  },
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: 2010,
    poster: "https://th.bing.com/th/id/OIP.fYLXgLBnnbp3N8JCRuUIGAHaLH?w=115&h=180&c=7&r=0&o=5&pid=1.7",
  },
];

const tempWatchedData = [
  {
    ImdbTitle: "tt0109830",
    title: "Forrest Gump",
    year: 1994,
    poster: "https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg",
    runtime: "142 min",
    imdbRating: 8.8,
    userRating: 9.2,
  },
  {
    ImdbTitle: "tt0111161",
    title: "The Shawshank Redemption",
    year: 1994,
    poster: "https://m.media-amazon.com/images/I/51NiGlapXlL._AC_SY679_.jpg",
    runtime: "142 min",
    imdbRating: 9.3,
    userRating: 9.5,
  },
  {
    ImdbTitle: "tt0076759",
    title: "Star Wars: Episode IV - A New Hope",
    year: 1977,
    poster: "  https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKU6wUKHH4H-kegDptliU-_V57RSKgTDjtZQ&s",
    runtime: "121 min",
    imdbRating: 8.6,
    userRating: 9.0,
  },
  {
    ImdbTitle: "tt0169547",
    title: "Gladiator",
    year: 2000,
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS47dRS_yG0hI4oPN7Fa0IDOLBvUfPUm51L3w&s",
    runtime: "155 min",
    imdbRating: 8.5,
    userRating: 8.9,
  },
];


const average = (arr) =>
  arr.reduce((acc, cur, arr) => acc + cur, 0) / arr.length;

const KEY = 'b27ad83f'
// const tempQuery = 'interstellar';

export default function App() {
  const [movies, setMovies] = useState();
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const [selectedId, setSelectedId] = useState(false)

  //fetch with promise before changing to async/await
  // useEffect(function () {
  //   setIsLoading(true);
  //   fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=interstellar`)
  //     .then(response => response.json())
  //     .then(data => {
  //       setMovies(data.Search);
  //       setIsLoading(false);
  // });
  // }, [])

  function handleSelectedMovie(id) {
    setSelectedId(selectedId => id === selectedId ? null : id)
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }


  useEffect(function () {
    setIsLoading(true);

    async function FetchingData() {
      try {
        const response = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`);

        if (!response.ok) {
          throw new Error('s.th wrong with network!!')
        }

        const data = await response.json();
        setMovies(data.Search);
      } catch (err) {
        console.log(err.message)
        setError(err.message)
      } finally {
        setIsLoading(false);
      }
    }
    FetchingData();
  }, [query])


  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main >
        <Box >
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />}
          {error && <Error message={error} />}
        </Box>
        <Box >
          {selectedId ?
            <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} /> :
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          }

        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className='loader'>LOADING ... </p>
}

function Error({ message }) {
  return (<p>{message}</p>)
}


function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}


function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}


function Logo() {
  return (
    <div className="logo">
      <img width="50" height="50" src="https://img.icons8.com/color/96/popcorn.png" alt="popcorn" />
      <h2> usePopCorn</h2>
    </div>
  );
}


function NumResults({ movies }) {
  return (
    <p className="num-results">
      found <strong> X </strong> results
    </p>
  );
}


function Main({ children }) {
  return <main className='main'>{children}</main>;
}


function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && children}
    </div>
  )
}


function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className='list'>
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  )
}

function Movie({ movie, onSelectMovie }) {

  return (
    <div className='list-movie-item' onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <div className='list-item-details'>
        <h4>{movie.Title}</h4>
        <span>{movie.Year}</span>
      </div>
    </div>
  )
}


function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbrating));
  const avgRunTime = average(watched.map((movie) => movie.runtime));
  const avgUserRating = average(watched.map((movie) => movie.userrating));

  return (
    <div className='summary'>
      <h3>Movies you watched</h3>
      <div className='summary-total-details'>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8c137 0 248 111 248 248S393 504 256 504S8 393 8 256S119 8 256 8M140 300h116v70.9c0 10.7 13 16.1 20.5 8.5l114.3-114.9c4.7-4.7 4.7-12.2 0-16.9l-114.3-115c-7.6-7.6-20.5-2.2-20.5 8.5V212H140c-6.6 0-12 5.4-12 12v64c0 6.6 5.4 12 12 12" /></svg>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 512 512"><path fill="#ffb636" d="m252.5 381l-128 49c-5.9 2.2-12.1-2.3-11.8-8.6l7-136.9c.1-2.1-.6-4.2-1.9-5.9L31.6 172c-4-4.9-1.6-12.2 4.5-13.9l132.4-35.6c2.1-.6 3.9-1.9 5-3.7L248.3 4c3.4-5.3 11.2-5.3 14.6 0l74.8 114.9c1.2 1.8 3 3.1 5 3.7l132.4 35.6c6.1 1.6 8.5 9 4.5 13.9l-86.1 106.6c-1.3 1.7-2 3.8-1.9 5.9l7 136.9c.3 6.3-5.9 10.8-11.8 8.6l-128-49c-2.1-.8-4.3-.8-6.3-.1" /><path fill="#ffd469" d="m456.1 51.7l-41-41c-1.2-1.2-2.8-1.7-4.4-1.5s-3.1 1.2-3.9 2.6l-42.3 83.3c-1.2 2.1-.8 4.6.9 6.3c1 1 2.4 1.5 3.7 1.5c.9 0 1.8-.2 2.6-.7L454.9 60c1.4-.8 2.4-2.2 2.6-3.9c.3-1.6-.3-3.2-1.4-4.4m-307 43.5l-42.3-83.3c-.8-1.4-2.2-2.4-3.9-2.6c-1.6-.2-3.3.3-4.4 1.5l-41 41c-1.2 1.2-1.7 2.8-1.5 4.4s1.2 3.1 2.6 3.9l83.3 42.3c.8.5 1.7.7 2.6.7c1.4 0 2.7-.5 3.7-1.5c1.7-1.8 2-4.4.9-6.4m140.7 410l-29-88.8c-.2-.9-.7-1.7-1.3-2.3c-1-1-2.3-1.5-3.7-1.5c-2.4 0-4.4 1.6-5.1 3.9l-29 88.8c-.4 1.6-.1 3.3.9 4.6s2.5 2.1 4.2 2.1h57.9c1.6 0 3.2-.8 4.2-2.1c1.1-1.4 1.4-3.1.9-4.7" /></svg>
          <span>{avgImdbRating} movies</span>
        </p>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><g class="star-outline"><path fill="#ffb636" fill-rule="evenodd" d="m15.974 7.03l-1.19-2.964c-1.008-2.51-4.56-2.51-5.568 0L8.026 7.03l-3.187.216c-2.698.183-3.796 3.561-1.72 5.295l2.45 2.048l-.779 3.098c-.66 2.623 2.214 4.71 4.505 3.273L12 19.262l2.705 1.698c2.29 1.438 5.165-.65 4.505-3.273l-.78-3.098l2.452-2.048c2.075-1.734.977-5.112-1.72-5.295zm-3.046-2.22c-.336-.836-1.52-.836-1.856 0L9.648 8.359a1 1 0 0 1-.86.625l-3.814.258c-.9.061-1.265 1.188-.574 1.766l2.934 2.45a1 1 0 0 1 .328 1.011l-.932 3.707c-.22.874.738 1.57 1.501 1.091l3.237-2.032a1 1 0 0 1 1.064 0l3.237 2.032c.763.48 1.721-.217 1.501-1.09l-.932-3.707a1 1 0 0 1 .328-1.012l2.934-2.45c.691-.579.325-1.705-.574-1.766l-3.813-.258a1 1 0 0 1-.86-.625L12.927 4.81Z" class="Vector" ClipRule="evenodd" /></g></svg>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><g fill="#ffb636"><path d="M13 6h-2v1a1 1 0 1 0 2 0z" /><path fill-rule="evenodd" d="M6 2v2h1v3a5 5 0 0 0 5 5a5 5 0 0 0-5 5v3H6v2h12v-2h-1v-3a5 5 0 0 0-5-5a5 5 0 0 0 5-5V4h1V2zm3 2h6v3a3 3 0 1 1-6 0zm0 13v3h6v-3a3 3 0 1 0-6 0" ClipRule="evenodd" /></g></svg>
          <span>{avgRunTime} min</span>
        </p>
      </div>
    </div>
  )
}


function WatchedMoviesList({ watched }) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <li key={movie.ImdbID}>
          <img src={movie.poster} alt={`${movie.title} poster`} />
          <div className='list-item-details'>
            <h4>{movie.title}</h4>
            <div className='list-item'>
              <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 512 512"><path fill="#ffb636" d="m252.5 381l-128 49c-5.9 2.2-12.1-2.3-11.8-8.6l7-136.9c.1-2.1-.6-4.2-1.9-5.9L31.6 172c-4-4.9-1.6-12.2 4.5-13.9l132.4-35.6c2.1-.6 3.9-1.9 5-3.7L248.3 4c3.4-5.3 11.2-5.3 14.6 0l74.8 114.9c1.2 1.8 3 3.1 5 3.7l132.4 35.6c6.1 1.6 8.5 9 4.5 13.9l-86.1 106.6c-1.3 1.7-2 3.8-1.9 5.9l7 136.9c.3 6.3-5.9 10.8-11.8 8.6l-128-49c-2.1-.8-4.3-.8-6.3-.1" /><path fill="#ffd469" d="m456.1 51.7l-41-41c-1.2-1.2-2.8-1.7-4.4-1.5s-3.1 1.2-3.9 2.6l-42.3 83.3c-1.2 2.1-.8 4.6.9 6.3c1 1 2.4 1.5 3.7 1.5c.9 0 1.8-.2 2.6-.7L454.9 60c1.4-.8 2.4-2.2 2.6-3.9c.3-1.6-.3-3.2-1.4-4.4m-307 43.5l-42.3-83.3c-.8-1.4-2.2-2.4-3.9-2.6c-1.6-.2-3.3.3-4.4 1.5l-41 41c-1.2 1.2-1.7 2.8-1.5 4.4s1.2 3.1 2.6 3.9l83.3 42.3c.8.5 1.7.7 2.6.7c1.4 0 2.7-.5 3.7-1.5c1.7-1.8 2-4.4.9-6.4m140.7 410l-29-88.8c-.2-.9-.7-1.7-1.3-2.3c-1-1-2.3-1.5-3.7-1.5c-2.4 0-4.4 1.6-5.1 3.9l-29 88.8c-.4 1.6-.1 3.3.9 4.6s2.5 2.1 4.2 2.1h57.9c1.6 0 3.2-.8 4.2-2.1c1.1-1.4 1.4-3.1.9-4.7" /></svg>
                <span>{movie.imdbRating}</span>
              </p>
              <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><g class="star-outline"><path fill="#ffb636" fill-rule="evenodd" d="m15.974 7.03l-1.19-2.964c-1.008-2.51-4.56-2.51-5.568 0L8.026 7.03l-3.187.216c-2.698.183-3.796 3.561-1.72 5.295l2.45 2.048l-.779 3.098c-.66 2.623 2.214 4.71 4.505 3.273L12 19.262l2.705 1.698c2.29 1.438 5.165-.65 4.505-3.273l-.78-3.098l2.452-2.048c2.075-1.734.977-5.112-1.72-5.295zm-3.046-2.22c-.336-.836-1.52-.836-1.856 0L9.648 8.359a1 1 0 0 1-.86.625l-3.814.258c-.9.061-1.265 1.188-.574 1.766l2.934 2.45a1 1 0 0 1 .328 1.011l-.932 3.707c-.22.874.738 1.57 1.501 1.091l3.237-2.032a1 1 0 0 1 1.064 0l3.237 2.032c.763.48 1.721-.217 1.501-1.09l-.932-3.707a1 1 0 0 1 .328-1.012l2.934-2.45c.691-.579.325-1.705-.574-1.766l-3.813-.258a1 1 0 0 1-.86-.625L12.927 4.81Z" class="Vector" ClipRule="evenodd" /></g></svg>
                <span>{movie.userRating}</span>
              </p>
              <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><g fill="#ffb636"><path d="M13 6h-2v1a1 1 0 1 0 2 0z" /><path fill-rule="evenodd" d="M6 2v2h1v3a5 5 0 0 0 5 5a5 5 0 0 0-5 5v3H6v2h12v-2h-1v-3a5 5 0 0 0-5-5a5 5 0 0 0 5-5V4h1V2zm3 2h6v3a3 3 0 1 1-6 0zm0 13v3h6v-3a3 3 0 1 0-6 0" ClipRule="evenodd" /></g></svg>
                <span>{movie.runtime}</span>
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}


function MovieDetails({ selectedId, onCloseMovie }) {
  const [movie, setMovie] = useState({});

  const { title: title, Year: year, poster: poster, Runtime: runtime, imdbRating, released: released, Actors: actors, Director: director, Genre: genre } = movie

  useEffect(function () {
    async function getMovieDetails() {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await response.json();
      setMovie(data)
    }
    getMovieDetails();
  }, []);

  return (
    <div className='details'>
      <header>
        <button className='btn-back' onClick={onCloseMovie}> &larr; </button>
        <img src={poster} alt={`poster of ${movie.title}`} />
        <div className='details-overview'>
          <h2>{title}</h2>
          <p>{released}</p>
        </div>
      </header>
      {selectedId}
    </div>
  )
}