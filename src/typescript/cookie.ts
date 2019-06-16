interface CookieHash {
    [name: string] : string;
}

interface CookieOptions {
    [name: string] : string|number|Date;
}

export class Cookie {
    static getAll() {
        let cookies: CookieHash = {}

        document.cookie.split(";").forEach(cookie => {
            let parts = cookie.trim().split("=")
            let name = parts[0]
            let value = decodeURIComponent(parts[1])

            cookies[name] = value
        })

        return cookies
    }

    static get(name: string):string {
        let cookies = Cookie.getAll()
        let value = cookies[name]

        if ( typeof(value) === "undefined" ) {
            return ""
        }

        return value
    }

    static set(name: string, value: any, options: CookieOptions={}):void {
        let encodedValue = decodeURIComponent(String(value))
        let cookieString = `${name}=${encodedValue}`

        // forEach options
        for (var k in options){
            let optValue = ""
            let optType = typeof(options[k])

            // TODO: convert `Date` object to string
            if ( options[k] instanceof Date ) {
                throw new Error("Not Implemented")
            } else if ( optType === "string" || optType === "number" ) {
                optValue = String(options[k])
            }

            if ( optValue !== "" ) {
                cookieString += `;${k}=${optValue}`
            }
        }

        document.cookie = cookieString
    }
}
