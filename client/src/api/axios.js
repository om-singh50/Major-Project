import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://major-project-backend-okz9.onrender.com/api', // Change this in production
});

export default instance;
