import { Location, NavigateFunction, Params } from "react-router-dom";

export interface WithRouterPropsInterface {
    router: {
        location: Location;
        navigate: NavigateFunction;
        params: Readonly<Params<string>>;
    }
}