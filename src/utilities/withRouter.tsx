import React,{JSXElementConstructor, ReactNode,PropsWithChildren, Component, ComponentType } from "react";
import {
  Params,
  SetURLSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Location, NavigateFunction } from "react-router-dom";
import { ParsedParams, searchParams } from "@root/utilities/querySearch";

export type routeParams = Readonly<Params<string>>;
export declare interface withRouterProps{
  location:Location,
  navigate: NavigateFunction,
  params: routeParams
  query: ParsedParams
  setParam: SetURLSearchParams
}


function withRouter(Item:JSXElementConstructor<any>) {
  function ComponentWithRouterProp(props:any) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    let searchParamsList = useSearchParams();
    let [paramsList,setParam] = searchParamsList;
    let query = searchParams(location?.search || "");
    return (
      <Item
        {...props}
        location={location}
        navigate={navigate}
        params={params}
        query={query}
        setParam={setParam}
      />
    );
  }
  return ComponentWithRouterProp;
}

export {withRouter};