// D:/Synapse/backend/server_api/src/utils/pythonApiClient.js
import axios from 'axios';

// Create an Axios instance pre-configured for the Python AI Engine
const pythonApiClient = axios.create({
  baseURL: process.env.PYTHON_AI_ENGINE_URL,
  timeout: 15000, // Optional: set a timeout of 15 seconds
});

export default pythonApiClient;