import { GridStackNode, GridStackOptions } from "gridstack";

export const defaultGridStackNode: GridStackNode = {
    w: 2,
    h: 2,
    minW: 1,
    maxW: 2,
    minH: 1,
    maxH: 2
}

export const defaultGridStackOptions: GridStackOptions = {
    cellHeight: 220,
    columnOpts: {
        columnMax: 4,
        breakpoints: [
            {
                w: 1400,
                c: 4
            },
            {
                w: 900,
                c: 2
            },
            {
                w: 480,
                c: 1
            }
        ],
    },
    float: false,
    margin: 8,
    disableResize: true
}