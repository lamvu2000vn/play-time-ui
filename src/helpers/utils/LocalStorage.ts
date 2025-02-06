export default class LocalStorage {
    private static get(key: string): string {
        return localStorage.getItem(key) || "";
    }

    private static set(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    private static remove(key: string) {
        localStorage.removeItem(key);
    }

    static getTheme(): string {
        return this.get("playtimeTheme");
    }

    static setTheme(theme: string) {
        return this.set("playtimeTheme", theme);
    }

    static removeTheme() {
        return this.remove("playtimeTheme");
    }

    static getBackgroundImage(): string {
        return this.get("playtimeBackgroundImage");
    }

    static setBackgroundImage(backgroundImage: string) {
        return this.set("playtimeBackgroundImage", backgroundImage);
    }

    static removeBackgroundImage() {
        return this.remove("playtimeBackgroundImage");
    }
}
