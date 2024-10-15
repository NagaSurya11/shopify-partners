import { AbstractCRUDRepository } from "../../graphql-client/repositories";
import { AreaChartDataType } from "../components/area-chart/types/interfaces";
import { BarChartDataType } from "../components/bar-chart/types/interfaces";
import { Bundle, BundleTableInput, BundleTableOutput } from "../components/bundle-table/types/interfaces";
import { PieChartDataType } from "../components/pie-chart/types/interfaces";
import { ScatteredChartDataType } from "../components/scattered-chart/types/interfaces";

export class DashboardRepository extends AbstractCRUDRepository {

    private getTotalSoldByPriceBarChartOrPieChartDataQuery() {
        return `
        query GetTotalSoldByPriceBarOrPieChartData{
            GetTotalSoldByPriceBarOrPieChartData {
                total_sold
                name
                fill
            }
        }
        `;
    }

    private GetTotalSoldByPriceScatteredChartDataQuery() {
        return `
            query GetTotalSoldByPriceScatteredChartData{
                GetTotalSoldByPriceScatteredChartData {
                    total_sold
                    bundle_price
                    revenue,
                    fill
                }
            }
        `;
    }

    private getTotalSoldAndRevenueByPriceAreaChartDataQuery() {
        return `
        query GetTotalSoldAndRevenueByPriceAreaChartData{
            GetTotalSoldAndRevenueByPriceAreaChartData {
                total_sold
                name
                revenue
            }
        }
        `;
    }

    private listBundlesQuery() {
        return `
        query ListBundles($input: ListBundlesInput!) {
            ListBundles(listBundlesInput: $input) {
                rows {
                bundle_id
                name
                discount_percentage
                total_sold
                bundle_price
                }
                totalRows
            }
        }
        `;
    }

    private deleteBundlesQuery() {
        return `
        mutation DeleteBundles($bundleIds: [String]!){
            DeleteBundles(bundleIds: $bundleIds)
        }
        `;
    }

    private getBundleByIdQuery() {
        return `
        query GetBundleById($bundleId: ID!){
            GetBundleById(id: $bundleId) {
                bundle_id
                name
                discount_percentage
                total_sold
                bundle_price
                Products {
                product_id
                quantity
                }
            }
        }
        `;
    }

    getTotalSoldByPriceBarChartOrPieChartData() {
        return super.watchQuery<{ GetTotalSoldByPriceBarOrPieChartData: PieChartDataType | BarChartDataType }>(this.getTotalSoldByPriceBarChartOrPieChartDataQuery());
    }

    getTotalSoldByPriceScatteredChartData() {
        return super.watchQuery<{ GetTotalSoldByPriceScatteredChartData: ScatteredChartDataType }>(this.GetTotalSoldByPriceScatteredChartDataQuery());
    }

    getTotalSoldAndRevenueByPriceAreaChartData() {
        return super.watchQuery<{ GetTotalSoldAndRevenueByPriceAreaChartData: AreaChartDataType }>(this.getTotalSoldAndRevenueByPriceAreaChartDataQuery());
    }

    listBundles(input: BundleTableInput) {
        return super.watchQuery<{ ListBundles: BundleTableOutput }>(this.listBundlesQuery(), { input });
    }

    deleteBundles(bundleIds: Array<string>) {
        return super.mutate<{ DeleteBundles: string }>(this.deleteBundlesQuery(), { bundleIds });
    }

    getBundleById(bundleId: string) {
        return super.watchQuery<{GetBundleById: Bundle}>(this.getBundleByIdQuery(), { bundleId });
    }
}