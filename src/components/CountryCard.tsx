import React, { Component } from "react";
import { api, CountryItem } from "@root/utilities/countriesApi";
import { withRouterProps, withRouter } from "@root/utilities/withRouter";
import { randomIDMultiple } from "@root/utilities/randomID";
import waitUntilVisible from "@root/utilities/waitUntilVisible";
import { loadImages } from "@root/utilities/countriesApi";
import { __ } from "@root/utilities/Lang";
import { cacheList } from "@root/utilities/countriesApi";
import { wait } from "@root/utilities/wait";


interface CountryCardProps extends withRouterProps {
    item: CountryItem,
    loaded: boolean,
    flag: string,
    current?:string
}

interface FlagProps {
    uri: string,
    alt?: string,
}
const datenow = Date.now();
class CoreCard extends Component<CountryCardProps> {
    state = {
        loaded: this.props.loaded,
        flag: this.props.flag
    }
    constructor(props: CountryCardProps) {
        super(props);
        this.tempID = randomIDMultiple();
    }
    tempID = "";

    controller: null | AbortController = null;

    Flag = ({ bkg }: { bkg?: boolean }) => {
        const { flag } = this.state;
        const { alt } = this.props.item.flags;
        return (
            <img
                src={flag + "?v=" /***+ ((process && process?.env?.version) ?? "0")  */}
                loading="lazy"
                width={180}
                height={120}
                alt={alt && !bkg ? __(alt) : ""}
                className={"flag_img" + (bkg ? " bkg" : "")}
                onLoad={(e) => {
                    if (this.container) {
                        this.container.setAttribute("data-loaded", "true");
                        return;
                    }
                    e.currentTarget.closest("card_element")?.setAttribute("data-loaded", "true");
                }}
            />
        )
    }
    Loader = () => {
        return (
            <>
                <div className="flag_img load_card">
                    <div className="loader"></div>
                </div>
                <img
                    width={180}
                    height={120}
                    className="flag_img empty"
                />
            </>
        )
    }
    container: HTMLDivElement | null = null;
    goToCountry = async () => {

        const formSearch = document.querySelector(".form_search") as HTMLDivElement | null;
        const countries_list = document.querySelector(".countries_list") as HTMLDivElement | null;

        formSearch?.classList.add("hide");
        countries_list?.classList.add("hide");

        await wait(0.3);
        this.props.navigate({
            pathname: `/country/` + this.props.item.cca3.toLowerCase()
        })
    }

    processRegion = () => {
        return (this.props.current ?? "").length > 2;
    }

    goToRegion = () => {
        for (let i = 0; i < api.continents.length; i++) {
            const region = api.continents[i].toLowerCase()
            const element = new RegExp(region, "i");
            if (element.test(this.props.item.region)) {
                if (!element.test(this.props.location.pathname)) {
                    this.props.navigate({
                        pathname: `/` + region
                    });
                }
                return;
            }
        }
        this.props.navigate({
            pathname: `/` + this.props.item.region.replace(/[^a-z]/i, "_").replace(/\-+/, "-").toLowerCase()
        })

    }

    render() {
        const { Flag, Loader } = this;
        const { navigate, item } = this.props;
        const { name, population, capital, region } = item;
        // if (this.state.flag == "" || this.state.loaded < 1) {
        //     return null
        // }
        const current = this.processRegion();
        return (
            <div
                className="card_element"
                key={this.tempID}
                data-loaded={this.state.loaded ? "true" : "false"}
                ref={ref => {
                    this.container = ref;
                }}
            >
                <div
                    className="flag"
                    onClick={this.goToCountry}
                >
                    <Flag />

                </div>
                <div className="info">
                    <h2 onClick={this.goToCountry}>{name.common}</h2>
                    <ul>
                        <li>
                            <h3 >{__("Population")}:</h3>
                            <span>{population.toLocaleString()}</span>
                        </li>
                        <li className={"region" + (current ? " current" : "")} onClick={current ? undefined :this.goToRegion}>
                            <h3>{__("Region")}:</h3>
                            <span>{region}</span>
                        </li>
                        {
                            capital && Array.isArray(capital) && capital.length > 0 ? (
                                <li>
                                    <h3>{__("Capital")}:</h3>
                                    <div className="capitals">
                                        {
                                            capital.map((item) => (
                                                <div key={item}>{item}</div>
                                            ))
                                        }
                                    </div>
                                </li>
                            )
                                : null
                        }
                    </ul>
                </div>
            </div>
        )
    }
}


export default withRouter(CoreCard);