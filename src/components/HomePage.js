
import MoviePage from "./MoviePage";
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import debounce from 'lodash/debounce';
import axios from 'axios';
import config from '../config';

function HomePage() {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);

    const debouncedSearch = debounce(async (keyword) => {
        try {
            const response = await axios.get(`${config.apiUrl}search?search=${keyword}`);
            const data = response.data;
            // console.log(data)
            setMovies(data.Search);
        } catch (err) {
            console.error(err);
        }
    }, 300);

    const handleSearch = (e) => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
    };

    useEffect(() => {
        return () => debouncedSearch.cancel();
    }, []);

    const GetFavorites = async () => {
        setIsFavorite(!isFavorite);

        if(!isFavorite){
            try {
                const response = await axios.get(`${config.apiUrl}favorites`);
                const data = response.data;
                console.log(data)
                setMovies(data);
            } catch (err) {
                console.error(err);
            }
        }else{
            debouncedSearch();
        }

    };

    return (
        <div className="HomePage">
            <form className="form" >
                <h5>Movies Hub</h5>
                <button className="home-fav-button" title="Favorite" onClick={(e) => { e.preventDefault(); GetFavorites(); }}>
                    {isFavorite ? (
                        <i className="fas fa-heart"></i>
                    ) : (
                        <i className="far fa-heart"></i>
                    )}
                </button>
                <input
                    className="search-input"
                    type="input"
                    placeholder="Search i.e Hulk, batman"
                    value={query}
                    onChange={handleSearch}
                />
                <button className="button" type="button" onClick={(e) => { e.preventDefault(); debouncedSearch(query); }}>
                    &#128269; Search
                </button>
                {movies.length>0 && <p>Results Found : <code>({movies.length})</code></p>}
                {movies.length === 0 && <p>Movies Not Found! <code>Search agin</code></p>}
            </form>
            <div className="card-list">
                <Grid container spacing={2}>
                    {Array.isArray(movies) && movies.filter(movie => movie.Poster).map(movie => (
                        <MoviePage movies={movie} index={movie.imdbID} key={movie.imdbID} handleSearch={handleSearch} />
                    ))}
                </Grid>
            </div>
        </div>
    );
}

export default HomePage;

