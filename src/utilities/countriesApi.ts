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
    svg?: string,
    png?: string
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
    population: number,
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
    data: CountryItem[] = [];
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
            .catch((error) => {
                console.error("Failed to fetch data:", error);
                return null;
            });

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
    continents = ["Africa", "America", "Asia", "Europe", "Oceania", "Antarctic"];
    filter(data: filterfields = {}): CountryItem[] {
        if (!this.data) {
            return [];
        }
        let preData = this.data;
        data.search = data?.search ? data.search.trim() : "";
        data.continent = data?.continent ? data.continent.trim() : "";


        const result = [...this.data].filter(item => {
            if (data.search && data.search != "" && data.search.length > 1) {
                const namereg = new RegExp(data.search, "i");
                if (
                    !namereg.test(item.name.common) && //dont is on the commong search
                    !namereg.test(item.name.official) && // dont is an common name
                    item.altSpellings.filter(alt => namereg.test(alt)).length == 0
                ) {
                    //search doesnt match
                    return false;
                }
            }
            if (data.continent && !this.continents.includes(data.continent)) {
                return false;
            }
            return true;
        })
        //will order by name
        // .sort((a, b) => {
        //     const nameA = a.name.official.toLowerCase();
        //     const nameB = b.name.official.toLowerCase();

        //     if (nameA < nameB) return -1;
        //     if (nameA > nameB) return 1;
        //     return 0;
        // });

        return result;
    }
}

interface filterfields {
    search?: string,
    continent?: string,
}


const api = new coreApi();

class CacheImages {
    loaded: { [key: string]: boolean } = {};
    pending: Map<string, Promise<boolean>> = new Map();

    check(uri: string) {
        return this.loaded[uri] ?? false;
    }

    async load(uri: string): Promise<boolean> {
        if (this.loaded[uri]) return true;

        if (this.pending.has(uri)) {
            const el = await this.pending.get(uri);
            return el ? true : false;
        }

        const promise = new Promise<boolean>((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.loaded[uri] = true;
                this.pending.delete(uri);
                resolve(true);
            };
            img.onerror = () => {
                this.pending.delete(uri);
                resolve(false);
            };
            img.src = uri;
        });

        this.pending.set(uri, promise);
        return await promise;
    }
}


interface loadProps {
    uri: string;
    signal: AbortSignal;
    callback?: () => void;
}

class cacheFetch {
    private completed: Set<string> = new Set();
    private queue: { [key: string]: loadProps } = {};
    private isFetching: boolean = false;

    check(uri: string) {
        return this.completed.has(uri)
    }
    async load(data: loadProps) {
        const { uri } = data;

        // If already fetched, skip
        if (this.completed.has(uri)) {
            return;
        }

        // If already in queue, skip
        if (this.queue[uri]) {
            return;
        }

        // Add to queue
        this.queue[uri] = data;

        // If not currently fetching, start the process
        if (!this.isFetching) {
            this.processQueue();
        }
    }

    private async processQueue() {
        this.isFetching = true;

        while (Object.keys(this.queue).length > 0) {
            const [uri, data] = Object.entries(this.queue)[0];

            // Remove from queue before starting
            delete this.queue[uri];

            try {
                const response = await fetch(uri, { signal: data.signal });

                if (!data.signal.aborted) {
                    this.completed.add(uri);
                    if (data.callback) {
                        data.callback();
                    }
                }
            } catch (error) {
                if (data.signal.aborted) {
                    // Fetch was aborted, do nothing
                } else {
                    console.error(`Error fetching ${uri}:`, error);
                }
            }
        }

        this.isFetching = false;
    }
}


const cacheList = new cacheFetch();

const loadImages = new CacheImages();
export { cacheList };
export { loadImages }
export { api };