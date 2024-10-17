import { ComponentType, LazyExoticComponent } from "react";

export interface RouteConfigInterface {
    component: LazyExoticComponent<ComponentType>;
    path: string;
    exact?: boolean;
}