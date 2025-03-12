export default class SessionStorage {
    private static get(key: string): string | null {
        return sessionStorage.getItem(key);
    }

    private static set(key: string, value: string) {
        return sessionStorage.setItem(key, value);
    }

    private static remove(key: string) {
        return sessionStorage.removeItem(key);
    }

    static getAppSession() {
        return this.get("appSession");
    }

    static setAppSession(session: string): void {
        this.set("appSession", session);
    }

    static removeAppSession() {
        this.remove("appSession");
    }

    static getRedirectTo() {
        return this.get("redirectTo");
    }

    static setRedirectTo(value: string): void {
        this.set("redirectTo", value);
    }

    static removeRedirectTo() {
        this.remove("redirectTo");
    }
}
