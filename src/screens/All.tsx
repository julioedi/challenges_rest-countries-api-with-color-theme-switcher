import React,{Component, ComponentType} from "react";
import {withRouter,withRouterProps} from "@root/utilities/withRouter";

interface ScreenProps extends withRouterProps{
    path: string
}
class AllScreen extends Component<withRouterProps>{
    render(): React.ReactNode {
        console.log(this.props)
        return(
            <h1>Homepage</h1>
        )
    }
}

export {AllScreen}


export default withRouter(AllScreen);