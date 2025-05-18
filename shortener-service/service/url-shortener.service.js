import { nanoid } from 'nanoid';
import { db } from '../db/database.js';
import { ShortenResponse } from '../model/model.js';
import { AuthService } from './auth.service.js';

export class UrlShortenerService {
    constructor() {
        this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        this.authService = new AuthService(); // Let AuthService handle its own URL
        
        console.log(`URL Shortener Service initialized:`);
        console.log(`- Base URL: ${this.baseUrl}`);
        console.log(`- Auth Service URL (from env): ${process.env.AUTH_SERVICE_URL}`);
    }

    async generateShortKey(url, token = null, customKey = null) {
        let username = null;
        
        // If custom key is requested, token is required
        if (customKey) {
            console.log('Custom key requested:', customKey);
            if (!token) {
                console.error('Token missing for custom key request');
                throw new Error('Token is required for custom short keys');
            }
            
            try {
                console.log('Attempting to validate token for custom key');
                username = await this.authService.validateToken(token);
                console.log('Token validated successfully for user:', username);
            } catch (error) {
                console.error('Token validation failed:', error.message);
                throw new Error('Invalid or expired token');
            }
        }

        const shortKey = customKey || nanoid(8);
        console.log('Generated/Using short key:', shortKey);
        
        // Check if custom key is available
        if (customKey) {
            console.log('Checking if custom key is available:', customKey);
            const isAvailable = await db.checkShortKeyAvailable(customKey);
            if (!isAvailable) {
                console.error('Custom key already taken:', customKey);
                throw new Error('Custom short key is already taken');
            }
            console.log('Custom key is available');
        }

        try {
            await db.createShortUrl(url, shortKey, username);
            console.log('Successfully created short URL for:', url);
            return new ShortenResponse(shortKey, this.baseUrl);
        } catch (error) {
            console.error('Failed to create short URL:', error);
            throw new Error('Failed to create shortened URL');
        }
    }

    async getUrl(shortKey) {
        try {
            return await db.getOriginalUrl(shortKey);
        } catch (error) {
            throw new Error('Failed to retrieve original URL');
        }
    }

    async getUserUrls(username) {
        try {
            return await db.getUserUrls(username);
        } catch (error) {
            throw new Error('Failed to retrieve user URLs');
        }
    }
} 