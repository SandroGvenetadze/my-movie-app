import axios from 'axios'

// Axios instance
const apiClient = axios.create({
baseURL: import.meta.env.VITE_RAPIDAPI_BASEURL,
headers: {
  'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
  'x-rapidapi-host': import.meta.env.VITE_RAPIDAPI_HOST,
}
})

// Fetch all top movies
export const fetchTopMovies = async () => {
  try {
    const response = await apiClient.get('/')
    return response.data
  } catch (error: any) {
    // Pass error to be handled in UI
    throw error
  }
}

// Fetch single movie by ID
export const fetchMovieById = async (id: string) => {
  try {
    const response = await apiClient.get(`/movie/${id}`)
    return response.data
  } catch (error: any) {
    throw error
  }
}
