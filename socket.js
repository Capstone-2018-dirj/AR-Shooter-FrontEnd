import io from 'socket.io-client';
export const host = 'https://ar-shooter-server.herokuapp.com/';
const socket = io(host);
export default socket;
