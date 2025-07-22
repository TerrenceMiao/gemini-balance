import { ServiceName } from '../types/service';

class KeyManager {
    private keys: { [service: string]: string[] } = {};
    private keyUsage: { [key: string]: number } = {};
    private lastKeyIndex: { [service: string]: number } = {};

    /**
     * Add an API key for a specific service
     * @param service The service to add the key for
     * @param key The API key to add
     */
    addKey(service: ServiceName, key: string) {
        if (!key || key.trim() === '') {
            console.warn(`Attempted to add empty API key for ${service}`); 
            return;
        }
        
        if (!this.keys[service]) {
            this.keys[service] = [];
            this.lastKeyIndex[service] = 0;
        }
        
        // Avoid duplicate keys
        if (!this.keys[service].includes(key)) {
            this.keys[service].push(key);
            this.keyUsage[key] = 0;
        }
    }

    /**
     * Get an API key for a service using round-robin selection
     * @param service The service to get a key for
     * @returns An API key or null if none available
     */
    getKey(service: ServiceName): string | null {
        const serviceKeys = this.keys[service];
        if (!serviceKeys || serviceKeys.length === 0) {
            return null;
        }
        
        // Use round-robin with index tracking for better distribution
        const index = this.lastKeyIndex[service] % serviceKeys.length;
        const key = serviceKeys[index];
        
        // Update for next request
        this.lastKeyIndex[service] = (index + 1) % serviceKeys.length;
        this.keyUsage[key] = (this.keyUsage[key] || 0) + 1;
        
        return key;
    }
    
    /**
     * Get usage statistics for all keys
     * @returns Object containing key usage data
     */
    getKeyUsageStats() {
        return this.keyUsage;
    }
}

export default new KeyManager();