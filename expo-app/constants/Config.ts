/**
 * Application Configuration
 */

// Your local network IP address
// Check with `ifconfig` or `ipconfig`
const LOCAL_IP = '192.168.1.3';
const PORT = '8080';

export const Config = {
    API_BASE_URL: `http://${LOCAL_IP}:${PORT}`,
};
