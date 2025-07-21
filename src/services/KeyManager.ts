class KeyManager {
    private keys: { [service: string]: string[] } = {};

    addKey(service: string, key: string) {
        if (!this.keys[service]) {
            this.keys[service] = [];
        }
        this.keys[service].push(key);
    }

    getKey(service: string): string | null {
        const serviceKeys = this.keys[service];
        if (!serviceKeys || serviceKeys.length === 0) {
            return null;
        }
        // Simple round-robin for now
        const key = serviceKeys.shift();
        if (key) {
            serviceKeys.push(key);
            return key;
        }
        return null;
    }
}

export default new KeyManager();