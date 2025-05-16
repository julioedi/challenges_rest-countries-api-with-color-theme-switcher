import React, { Component, ComponentType } from "react";
import { withRouter, withRouterProps } from "@root/utilities/withRouter";
import CountryCard from "@root/components/CountryCard";
import { api, cacheList } from "@root/utilities/countriesApi";
import { randomIDMultiple } from "@root/utilities/randomID";
import { __ } from "@root/utilities/Lang";
import { searchParams } from "@root/utilities/querySearch";
import Search from "@root/components/Search";
import Close from "@root/components/Close";
import ExpandMore from "@root/components/ExpandMore";

interface ScreenProps extends withRouterProps {
    path: string
}
class AllScreen extends Component<ScreenProps> {
    state = {
        search: typeof this.props.query?.s == "string" ? this.props.query?.s : "",
        continent: this.props.path,
        page: 1
    }
    perPage: number = typeof this.props.query?.per_page == "number" && this.props.query?.per_page > 3 ? this.props.query?.per_page : 12;
    timses = -1;


    searchstring = "";
    searchtypes = 0;
    Top = () => {
        return (
            <div className="form_search">
                <div className="field_element search">
                    <Search />
                    <input
                        type="search"
                        defaultValue={this.state.search}
                        onChange={(e) => {
                            let { value } = e.target;
                            this.searchtypes++;
                            let types = this.searchtypes;
                            this.searchstring = value;
                            setTimeout(() => {
                                if (this.searchstring === value && types == this.searchtypes) {
                                    this.searchtypes = 0;
                                    const prev = searchParams();
                                    const newParams: any = {};
                                    for (const key in prev) {
                                        if (Object.prototype.hasOwnProperty.call(prev, key)) {
                                            const element = prev[key];
                                            if (typeof element != "object") {
                                                newParams[key] = element;
                                            }
                                        }
                                    }
                                    if (value.trim() == "") {
                                        if ("s" in newParams) {
                                            delete newParams.s
                                        }
                                    } else {
                                        newParams["s"] = value;
                                    }

                                    this.props.setParam(newParams);
                                    this.setState({
                                        search: value
                                    })
                                    // this.setState({
                                    //     search: value,
                                    //     page: 1
                                    // })
                                }
                            }, 500)

                        }}
                        placeholder={__("Search for a country...")}
                    />
                    <Close />
                </div>
                <div className="field_element select">
                    <select
                        onChange={(e) => {
                            const id = e.target.value;
                            if (id !== this.state.continent) {
                                this.props.navigate(`/${e.target.value}` + window.location.search);
                            }
                        }}
                        defaultValue={this.state.continent == "*" ? "" : this.state.continent}
                    >
                        <option value="">{__("All")}</option>
                        {
                            api.continents.map((item, index) => (
                                <option value={item.toLowerCase()} key={index}>{__(item)}</option>
                            ))
                        }
                    </select>
                    <ExpandMore />
                </div>
            </div>
        );
    }

    render(): React.ReactNode {
        const { Top } = this;
        const data = api.filter({
            search: this.state.search,
            continent: this.state.continent
        });
        // const total = this.perPage * this.state.page
        // data.length = total > data.length ? data.length : total;
        return (
            <>
                <Top />
                <div className="countries_list">
                    {
                        data.map((item, index) => {
                            const flag = (item.flags.svg ?? item.flags.png ?? "").trim();
                            const loaded = cacheList.check(flag);
                            const tempID = randomIDMultiple();
                            return (
                                <CountryCard item={item} key={tempID} flag={flag} loaded={loaded} current={this.state.continent} />
                            )
                        })
                    }
                </div>
            </>
        )
    }
}

export { AllScreen }


export default withRouter(AllScreen);