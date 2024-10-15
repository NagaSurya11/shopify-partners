import { PageSize } from "../enums";

export const PageNumberToSizeMap = new Map<number, PageSize>([
    [20, PageSize.TWENTY],
    [50, PageSize.FIFTY],
    // [100, PageSize.HUNDERED]
]);
