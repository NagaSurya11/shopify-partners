import { GraphQLEnumType } from "graphql";
import { SortOrder as SortOrderEnum } from '../../types/enums';

export const SortOrder = new GraphQLEnumType({
    name: 'SortOrder',
    values: {
        ASC: { value: SortOrderEnum.ASC },
        DESC: { value: SortOrderEnum.DESC }
    }
})