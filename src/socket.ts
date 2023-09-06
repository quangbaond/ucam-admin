import { io } from 'socket.io-client';

import { settings } from './api/const';

const URL: string = settings.API_URL;

export const socket = io(URL, {
    autoConnect: true,
});
