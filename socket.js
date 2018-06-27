import io from 'socket.io-client';
import { SERVER_URL } from 'react-native-dotenv';
export const host = SERVER_URL;
const socket = io(host);
export default socket;
