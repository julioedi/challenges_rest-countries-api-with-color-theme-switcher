import React, { Component } from "react";
import { CountryItem } from "@root/utilities/countriesApi";
import { withRouterProps, withRouter } from "@root/utilities/withRouter";
import { randomIDMultiple } from "@root/utilities/randomID";
import waitUntilVisible from "@root/utilities/waitUntilVisible";
import { loadImages } from "@root/utilities/countriesApi";
import { __ } from "@root/utilities/Lang";
import { cacheList } from "@root/utilities/countriesApi";

interface CountryCardProps extends withRouterProps {
    item: CountryItem,
    loaded:boolean,
    flag:string,
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
                src={flag + "?v=" + (process.env?.version ?? "0") }
                loading="lazy"
                width={180}
                height={120}
                alt={alt && !bkg ? __(alt) : ""}
                className={"flag_img" + (bkg ? " bkg" : "")}
                onLoad={(e) =>{
                    if (this.container) {
                        this.container.setAttribute("data-loaded","true");
                        return;
                    }
                    e.currentTarget.closest("card_element")?.setAttribute("data-loaded","true");
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
    container:HTMLDivElement|null = null;
    goToCountry = () =>{
        this.props.navigate({
            pathname:`/country/` + this.props.item.cca3.toLowerCase()
        })
    }
    render() {
        const { Flag, Loader } = this;
        const { navigate, item } = this.props;
        const { name, population, capital, region } = item;
        // if (this.state.flag == "" || this.state.loaded < 1) {
        //     return null
        // }
        return (
            <div
                className="card_element"
                key={this.tempID}
                data-loaded={this.state.loaded ? "true" : "false"}
                ref={ref =>{
                    this.container = ref;
                }}
                onClick={() =>{
                    this.goToCountry();
                }}
            >
                <div className="flag">
                    <Flag />

                </div>
                <div className="info">
                    <h2>{name.official}</h2>
                    <ul>
                        <li>
                            <h3>{__("Population")}:</h3>
                            <span>{population.toLocaleString()}</span>
                        </li>
                        <li>
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