class UtilCookies {
    public getCookie (name: string): string | undefined {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
        if (match) {
            return decodeURIComponent(match[2])
        } else {
            return undefined
        }
    }

    public setCookie (key: string, value: string): void {
        this.clearCookies()
        document.cookie = `${key}=${value}`
    }

    public clearCookies (): void {
        const allCookies = document.cookie.split(';')
        // The "expire" attribute of every cookie is
        // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
        for (let i = 0; i < allCookies.length; i++) {
            document.cookie = allCookies[i] + '=;expires=' + new Date(0)
                .toUTCString()
        }
    }
}

export default new UtilCookies()
