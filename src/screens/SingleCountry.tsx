import React, { Component, ComponentType } from "react";
import { withRouter, withRouterProps } from "@root/utilities/withRouter";
import { api, cacheList, CountryItem } from "@root/utilities/countriesApi";
import { randomID, randomIDMultiple } from "@root/utilities/randomID";
import { __ } from "@root/utilities/Lang";
import Back from "@root/components/Back";
import { wait } from "@root/utilities/wait";

interface multipleLists {
    data?: string[],
    single: string,
    plural: string,
}
class SingleCountry extends Component<withRouterProps> {
    item: CountryItem | null = null;
    state = {
        code: this.props.params.id as string
    }
    constructor(props: withRouterProps) {
        super(props);
        this.id = randomID();
        const id = (this.props.params.id as string).toLocaleUpperCase();
        const item = api.IDS[id] ?? null;
        if (item) {
            this.item = api.data[item];
        }
    }

    getItem = () => {
        const id = (this.props.params.id as string).toLocaleUpperCase();
        const preItem = api.IDS[id] ?? null;
        if (preItem) {
            return api.data[preItem];
        }
        return null;
    }
    id = "";
    selectors = async () => {
        const single = document.querySelector(".single_country") as HTMLDivElement | null;
        const top = document.querySelector(".single_top") as HTMLDivElement | null;
        single?.classList.add("hide");
        top?.classList.add("hide");
        await wait()
    }
    Top = () => {
        const id = this.props.params.id;
        return (
            <div className="single_top hide" ref={this.cleanRender} key={id}>
                <div className="btn" onClick={async () => {
                    const index = window.history.state?.idx ?? 0;
                    await this.selectors();
                    if (typeof index == "number" && index > 0) {
                        this.props.navigate(-1);
                    } else {
                        this.props.navigate("/");
                    }
                }}>
                    <Back /> {__("Back")}
                </div>
            </div>
        );
    }
    container: HTMLDivElement | null = null;
    Flag = () => {
        const item = this.getItem();
        if (!item) {
            return;
        }
        const { flags } = item;
        const flag = (flags.svg ?? flags.png ?? "").trim();
        const { alt } = flags;
        return (
            <img
                src={flag + "?v=" /***+ ((process && process?.env?.version) ?? "0")  */}
                loading="lazy"
                width={600}
                height={400}
                alt={alt ? __(alt) : ""}
                className=""
                onLoad={(e) => {
                    e.currentTarget?.classList.add("loaded");
                }}
            />
        )
    }

    cleanRender = (ref: HTMLDivElement | null) => {
        if (ref) {
            wait().then(() => {
                ref.classList.remove("hide");
            })
        }
    }

    SinglePlural = ({ data, single, plural }: multipleLists) => {
        // return null;
        const pre = data && Array.isArray(data) && data.length > 0 ? data : null;
        if (!pre) {
            return null;
        }
        return (
            <li>
                <h3>{pre.length > 1 ? __(plural) : __(single)}:</h3>
                <div className="capitals">
                    {
                        pre.map((item) => (
                            <div key={item}>{item}</div>
                        ))
                    }
                </div>

            </li>
        )
    }
    regex = api.continents.map((single) => new RegExp(single.toLowerCase(), "i"));



    CountriesBorder = () => {
        const item = this.getItem();
        if (!item) {
            return null;
        }
        const { borders } = item;
        if (!borders || !Array.isArray(borders) || borders.length == 0) {
            return null;
        }
        const name = borders.length > 1 ? "Borders" : "Border";
        return (
            <div className="borders">
                <h3>{__(name)}:</h3>
                <div className="list">
                    {
                        borders.map((item, index) => {
                            const next = api.IDS[item] ?? null;
                            if (!next) {
                                return;
                            }
                            const el = api.data[next]
                            return (
                                <div className="btn small" key={index}
                                    onClick={async () => {
                                        await this.selectors();
                                        this.item = el;
                                        this.setState({
                                            code: item
                                        })
                                        this.props.navigate(`/country/${item.toLowerCase()}`)
                                    }}
                                >
                                    {el.name.common}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
    render() {
        
        const item = this.getItem();
        const {Top, Flag, SinglePlural, CountriesBorder } = this;
        if (!item) {
            return null;
        }
        const { capital, name, tld, currencies, languages } = item;
        const keys = Object.keys(name.nativeName);
        const nativeName = keys.length > 0 ? name.nativeName[keys[0]].official : name.official;
        const region = this.regex.map((reg, index) => {
            if (reg.test(item.region)) {
                return index;
            }
            return null;
        }).filter(item => item != null);
        const regionName = region.length > 0 ? region[0] : null;

        const currenciesList = Object.keys(currencies).map(item => currencies[item].name);
        const languagesList = Object.keys(languages).map(item => languages[item]);
        const newId = randomID();
        return (
            <>
                <Top />
                <div className="hide single_country" ref={this.cleanRender} key={this.state.code + newId}>
                    <div className="flag">
                        <Flag />
                    </div>
                    <div className="info">
                        <h2>{item.name.common}</h2>
                        <ul>
                            <li>
                                <h3>{__("Native name")}:</h3>
                                <span>
                                    {nativeName}
                                </span>
                            </li>
                            <li>
                                <h3>{__("Population")}:</h3>
                                <span>
                                    {item.population.toLocaleString()}
                                </span>
                            </li>
                            <li>
                                <h3>{__("Region")}:</h3>
                                <span>
                                    {__(regionName ? api.continents[regionName] : item.region)}
                                </span>
                            </li>
                            {
                                item.subregion && (
                                    <li>
                                        <h3>{__("Sub Region")}:</h3>
                                        <span>
                                            {__(item.subregion)}
                                        </span>
                                    </li>
                                )
                            }
                            <SinglePlural data={capital} single="Capital" plural="Capitals" />
                        </ul>
                        <ul>
                            <SinglePlural data={tld} single="Top Level Domain" plural="Top Level Domains" />
                            <SinglePlural data={currenciesList} single="Currency" plural="Currencies" />
                            <SinglePlural data={languagesList} single="Language" plural="Languages" />
                        </ul>
                        <CountriesBorder />
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(SingleCountry);