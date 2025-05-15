import React, { Component, ComponentType } from "react";
import { withRouter, withRouterProps } from "@root/utilities/withRouter";
import CountryCard from "@root/components/CountryCard";
import { api, cacheList } from "@root/utilities/countriesApi";
import { randomIDMultiple } from "@root/utilities/randomID";

interface ScreenProps extends withRouterProps {
    path: string
}
class AllScreen extends Component<ScreenProps> {
    state = {
        search: typeof this.props.query?.s == "string" ? this.props.query?.s : "",
        continent: api.continents.includes(this.props.path) ? this.props.path : "",
        page: 1
    }
    perPage: number = typeof this.props.query?.per_page == "number" && this.props.query?.per_page > 3 ? this.props.query?.per_page : 12;
    timses = -1;
    render(): React.ReactNode {
        const data = [...api.data];
        const total = this.perPage * this.state.page
        data.length = total > data.length ? data.length : total;
        return (
            <>
                <h1 onClick={() => {
                    this.timses++;
                    this.forceUpdate();
                }}>Homepage</h1>
                <div className="countries_list">
                    {
                        data.map((item, index) => {
                            const flag = (item.flags.svg ?? item.flags.png ?? "").trim();
                            const loaded = cacheList.check(flag);
                            const tempID = randomIDMultiple();
                            return (
                                <CountryCard item={item} key={tempID} flag={flag} loaded={loaded} />
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