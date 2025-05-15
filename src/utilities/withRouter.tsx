import React,{ComponentClass, FunctionComponent, JSXElementConstructor, ReactNode,PropsWithChildren } from "react";
import {
  Params,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Location, NavigateFunction } from "react-router-dom";
import { ParsedParams, searchParams } from "@root/utilities/querySearch";

export type routeParams = Readonly<Params<string>>;
export declare interface withRouterProps extends ComponentClass{
  location:Location,
  navigate: NavigateFunction,
  params: routeParams
  query: ParsedParams
}


function withRouter(Item:JSXElementConstructor<any>) {
  function ComponentWithRouterProp(props:any) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    let query = searchParams(location?.search || "");
    return (
      <Item
        {...props}
        location={location}
        navigate={navigate}
        params={params}
        query={query}
      />
    );
  }
  return ComponentWithRouterProp;
}

export {withRouter};