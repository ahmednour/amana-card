import axios from 'axios';
const apiKey = process.env.NEXT_PUBLIC_API_URL;
const apiUrl = 'http://localhost:1337';

const axiosClient = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "multipart/form-data",
  },
});

export default axiosClient;
