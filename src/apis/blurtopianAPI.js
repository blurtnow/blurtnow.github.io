import Client from '../helpers/client'
require('dotenv').config()

const apiUrl = process.env.REACT_APP_API || 'http://localhost:3001';
const api = new Client(apiUrl);

export default api;