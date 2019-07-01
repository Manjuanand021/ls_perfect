export class ObfuscateIdUtil {
    /**
     * Creates a obfuscated string from a "string" of binary data using base 64 encoding
     */
    public static obfuscate(rawId: string): string {
        if (rawId) {
            return btoa(rawId);
        }
        return '';
    }

    /**
     * De obfuscate string which has been obfuscated using base-64 encoding.
     */
    public static deobfuscate(obfuscatedId: string): string {
        if (obfuscatedId) {
            return atob(obfuscatedId);
        }
        return '';
    }
}
