export class IndexSignatureUtil {
    /**
     * Checks if index exists in index signature.
     * @Param indexSignature: index signature to check.
     * @Param index: index to check.
     * @Returns boolean value
     */
    public static isIndexInIndexSignature(indexSignature: { [index: string]: any }, index: string): boolean {
        return Object.keys(indexSignature).find(i => i == index) !== undefined;
    }
}
