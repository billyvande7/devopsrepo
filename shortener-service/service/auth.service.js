import axios from 'axios';

export class AuthService {
    constructor(baseUrl = process.env.AUTH_SERVICE_URL) {
        if (!baseUrl) {
            throw new Error('Auth service URL is required - set AUTH_SERVICE_URL environment variable');
        }
        this.baseUrl = baseUrl;
        console.log(`Auth Service initialized with base URL (from env): ${this.baseUrl}`);
    }

    async login(username, password) {
        try {
            console.log(`Attempting login for user: ${username}`);
            const response = await axios.post(`${this.baseUrl}/login`, {
                username,
                password
            });
            console.log('Login successful');
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('Login failed:', error.response.data);
                throw new Error(error.response.data.error || 'Login failed');
            }
            console.error('Login service error:', error.message);
            throw new Error('Login service unavailable');
        }
    }

    async validateToken(token) {
        try {
            console.log('Validating token at:', `${this.baseUrl}/validate-token`);
            const response = await axios.get(`${this.baseUrl}/validate-token`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Token validation successful for user:', response.data.username);
            return response.data.username;
        } catch (error) {
            if (error.response) {
                console.error('Token validation failed:', error.response.data);
                console.error('Status code:', error.response.status);
                throw new Error(error.response.data.error || 'Token validation failed');
            }
            console.error('Token validation service error:', error.message);
            throw new Error('Token validation service unavailable');
        }
    }
} 