import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import config from '../config';


export default function MoviePage(props) {
    const { movies,index } = props
    
    const Card = (movies) => {
        const { movie } = movies;
        const [isFavorite, setIsFavorite] = useState(movie.fav_status);

        const AddToFavorite = async (body) => {
            setIsFavorite(!isFavorite);
            try {
                if(isFavorite){
                    const response = await axios.delete(`${config.apiUrl}favorites/${body.imdbID}`);
                    const data = response.data;
                    console.log(data)
                    if(data.success){
                        alert(data.msg);
                        // handleSearch();
                    }
                }else{
                    body.fav_status = true;
                    const response = await axios.post(`${config.apiUrl}favorites`,body);
                    const data = response.data;
                    console.log(data)
                    if(data.success){
                        alert(data.msg);
                        // handleSearch();
                    }
                }

            } catch (err) {
                console.error(err);
            }
        };
        return (
            <div className="card">
                <button className="favorite-button" onClick={()=>AddToFavorite(movie)}>
                    {isFavorite ? (
                        <i className="fas fa-heart"></i>
                    ) : (
                        <i className="far fa-heart"></i>
                    )}
                </button>
                <img className="movie-image" src={movie.Poster} alt={movie.Title + ' poster'} />
                <div className="movie-content">
                    <h3 className="movie-title">{movie.Title}</h3>
                    <p className="movie-info">
                        <small>Release Year: {movie.Year}</small>
                    </p>
                    <p className="movie-info">
                        <small>Type: {movie.Type}</small>
                    </p>
                </div>
            </div>
        );
    };
    return (<Grid item xs={3}> <Card movie={movies} key={index}/> </Grid>);
}
