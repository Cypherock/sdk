import axios from 'axios';
import { config } from '../config';

export const http = axios.create({ baseURL: config.CY_BASE_URL });
