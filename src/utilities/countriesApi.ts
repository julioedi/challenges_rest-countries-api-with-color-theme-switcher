import { tryParseJSON } from "./cookies";

export interface lang {
    official: string,
    common: string,
}
export interface nativeName {
    [key: string]: lang,
}
export interface countryName extends lang {
    nativeName: nativeName,
    population: number,
}

type list = Array<string>;
type objString = { [key: string]: string };

/**[latitude,longitude] */
type latlng = [number, number]

export type continents = "Africa" | "America" | "Asia" | "Europe" | "Oceania" | "Antarctic" | "";
export type mapPlatform = "googleMaps" | "openStreetMaps";
export interface currency {
    name: string,
    symbol: string,
}
export interface imagetype {
    alt?: string,
    svg: string,
    png: string
}
export interface CountryItem {
    altSpellings: list,
    area: number,
    borders: list,
    capital: list,
    capitalInfo: latlng[],
    car: {
        signs: list,
        side: "right" | "left"
    },
    cca2: string,
    cca3: string, //country code
    cioc?: string,
    coatOfArms: imagetype
    continents: Array<continents>
    currencies: {
        [key: string]: currency,
    },
    demonyms: {
        [key: string]: {
            f: string,
            m: string,
        }
    },
    fifa: string,
    flag: string,
    flags: imagetype
    idd: {
        root: string,
        suffixes: list,
    },
    independent: boolean,
    landlocked: boolean,
    languages: objString,
    latlng: latlng,
    maps: {
        [key in mapPlatform]: string
    },
    name: countryName,
    postalCode: {
        format: null | string,
        regex: null | string,
    },
    region: continents,
    startOfWeek: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
    status: string,
    subregion: string,
    timezones: list,
    tld: list,
    translations: nativeName,
    unMember: boolean
}


class coreApi {
    uri = "https://restcountries.com/v3.1/all";
    data: null | CountryItem[] = null;
    lastUpdate: null | string = null;
    IDS: {
        [key: string]: number
    } = {};
    isReady: boolean = false;

    isValidCache(data: any): data is [CountryItem[], string] {
        return (
            Array.isArray(data) &&
            typeof data[1] === "string" &&
            !isNaN(Date.parse(data[1]))
        );
    }

    processData() {
        if (!this.data) {
            return;
        }
        for (let i = 0; i < this.data.length; i++) {
            const country = this.data[i];
            this.IDS[country.cca3] = i;
        }
        this.isReady = true;
    }

    async setData() {
        const list = await fetch(this.uri)
            .then(res => res.json())
            .catch(error => null);

        if (list) {
            this.data = list as CountryItem[];
            const date = new Date().toISOString();
            const elements = [list, date]; // ⬅️ correct data structure
            window.localStorage.setItem("countries", JSON.stringify(elements));
            this.lastUpdate = date; // Optional: set this for immediate use
            this.processData();
            // console.log("less than a month");
        }
    }


    day = 86400000;
    async init(days: number = 30) {
        const preData = window.localStorage.getItem("countries");
        if (preData) {
            const tmpData = tryParseJSON(preData) as [CountryItem[], string];

            if (this.isValidCache(tmpData)) {
                const [items, timestamp] = tmpData;
                const oldDate = new Date(timestamp);
                const now = new Date();
                if (isNaN(oldDate.getTime())) {
                    await this.setData(); // fallback to fresh fetch
                    return;
                }
                if (now.getTime() - oldDate.getTime() < days * this.day) {
                    this.data = items;
                    this.lastUpdate = timestamp;
                    this.processData();
                    return;
                }
            }
        }
        await this.setData()
    }
}

const api = new coreApi();

export { api };