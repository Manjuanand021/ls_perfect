export class UrlUtil {
    public static prependUrl(url: string): string {
        return `${window.location.protocol}//${window.location.host}/${url}`;
    }
}
