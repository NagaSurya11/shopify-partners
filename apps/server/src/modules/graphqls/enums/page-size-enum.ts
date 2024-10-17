import { GraphQLEnumType } from "graphql";
import { PageSize as PageSizeEnum } from '../../types/enums';

export const PageSize = new GraphQLEnumType({
    name: 'PageSize',
    values: {
        TWENTY: { value: PageSizeEnum.TWENTY },
        FIFTY: { value: PageSizeEnum.FIFTY },
        HUNDERED: { value: PageSizeEnum.HUNDERED }
    }
})