import { WithTranslation } from "react-i18next";

export interface HeaderProps {
    isSideNavExpanded: boolean;
    toggleSideNav: (value: boolean) => void;
}