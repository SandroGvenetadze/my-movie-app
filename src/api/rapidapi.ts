// src/api/rapidapi.ts
// Purpose: TMDb axios client (replacing old RapidAPI).
import axios from 'axios';

// v3 key via query param
const apiClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: import.meta.env.VITE_TMDB_API_KEY as string },
});

// Top Rated (20 per page)
export const fetchTopMovies = async (page = 1) => {
  const { data } = await apiClient.get('/movie/top_rated', {
    params: { language: 'en-US', page },
  });
  return data; // { page, results, ... }
};

// Single movie by id (for Details page)
export const fetchMovieById = async (id: string) => {
  const { data } = await apiClient.get(`/movie/${id}`, {
    params: { language: 'en-US' },
  });
  return data;
};
