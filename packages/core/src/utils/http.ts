import axios from 'axios';
import { config } from '@cypherock/sdk-utils';

export const http = axios.create({ baseURL: config.API_CYPHEROCK });
