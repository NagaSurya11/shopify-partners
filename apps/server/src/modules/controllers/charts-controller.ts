import { cast, col, DataTypes, fn, QueryTypes, Sequelize } from "sequelize";
import { BundleModel } from "../models";
import { TotalSoldByPriceBarOrPieChart, TotalSoldByPriceScatteredChartData } from "../types/interfaces";

function getRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor.padStart(6, '0')}`;
}

async function GetTotalSoldByPriceBarOrPieChartData() {
    const orderMap = new Map<string, number>();
    orderMap.set('<1000', 1);
    orderMap.set('1000-2500', 2);
    orderMap.set('2500-5000', 3);
    orderMap.set('5000-10000', 4);
    orderMap.set('10000-15000', 5);
    orderMap.set('15000-25000', 6);
    orderMap.set('25000-50000', 7);
    orderMap.set('>50000', 8);

    // Define the CASE statement as a string for reuse
    const priceRanges = `
        SELECT unnest(ARRAY[
            '<1000',
            '1000-2500',
            '2500-5000',
            '5000-10000',
            '10000-15000',
            '15000-25000',
            '25000-50000',
            '>50000'
        ]) AS name
    `;

    const response: TotalSoldByPriceBarOrPieChart = await BundleModel.sequelize.query(`
  SELECT
    names.name,
    COALESCE(SUM(b.total_sold), 0) AS total_sold
  FROM
    (${priceRanges}) AS names
  LEFT JOIN (
    SELECT
      CASE
        WHEN bundle_price < 1000 THEN '<1000'
        WHEN bundle_price BETWEEN 1000 AND 2499 THEN '1000-2500'
        WHEN bundle_price BETWEEN 2500 AND 4999 THEN '2500-5000'
        WHEN bundle_price BETWEEN 5000 AND 9999 THEN '5000-10000'
        WHEN bundle_price BETWEEN 10000 AND 14999 THEN '10000-15000'
        WHEN bundle_price BETWEEN 15000 AND 24999 THEN '15000-25000'
        WHEN bundle_price BETWEEN 25000 AND 49999 THEN '25000-50000'
        ELSE '>50000'
      END AS name,
      total_sold
    FROM
      "Bundles"
  ) AS b ON names.name = b.name
  GROUP BY
    names.name
`, { type: QueryTypes.SELECT });
    return response
      .sort((a, b) => orderMap.get(a.name) - orderMap.get(b.name))
      .map(({name, total_sold}) => ({
        name,
        total_sold,
        fill: getRandomColor()
      }));
}

async function TotalSoldByPriceScatteredChartData() {
    const response: TotalSoldByPriceScatteredChartData = await BundleModel.sequelize.query(`
        SELECT
          bundle_price,
          total_sold,
          SUM(bundle_price * total_sold) AS revenue
        FROM
          "Bundles"
        WHERE
         total_sold > 0
        GROUP BY
          bundle_price,
          total_sold
      `, { type: QueryTypes.SELECT });
    return response.map(({bundle_price, total_sold, revenue}) => ({
      bundle_price,
      total_sold,
      revenue,
      fill: getRandomColor()
    }));
}

async function TotalSoldAndRevenueByPriceAreaChartData() {
    const orderMap = new Map<string, number>();
    orderMap.set('<1000', 1);
    orderMap.set('1000-2500', 2);
    orderMap.set('2500-5000', 3);
    orderMap.set('5000-10000', 4);
    orderMap.set('10000-15000', 5);
    orderMap.set('15000-25000', 6);
    orderMap.set('25000-50000', 7);
    orderMap.set('>50000', 8);

    // Define the CASE statement as a string for reuse
    const priceRanges = `
        SELECT unnest(ARRAY[
            '<1000',
            '1000-2500',
            '2500-5000',
            '5000-10000',
            '10000-15000',
            '15000-25000',
            '25000-50000',
            '>50000'
        ]) AS name
    `;

    const response: any[] = await BundleModel.sequelize.query(`
        SELECT
            names.name,
            COALESCE(SUM(b.total_sold), 0) AS total_sold,
            COALESCE(SUM(b.revenue), 0) AS revenue
        FROM
            (${priceRanges}) AS names
        LEFT JOIN (
            SELECT
                CASE
                    WHEN bundle_price < 1000 THEN '<1000'
                    WHEN bundle_price BETWEEN 1000 AND 2499 THEN '1000-2500'
                    WHEN bundle_price BETWEEN 2500 AND 4999 THEN '2500-5000'
                    WHEN bundle_price BETWEEN 5000 AND 9999 THEN '5000-10000'
                    WHEN bundle_price BETWEEN 10000 AND 14999 THEN '10000-15000'
                    WHEN bundle_price BETWEEN 15000 AND 24999 THEN '15000-25000'
                    WHEN bundle_price BETWEEN 25000 AND 49999 THEN '25000-50000'
                    ELSE '>50000'
                END AS name,
                total_sold,
                (bundle_price * total_sold) AS revenue  -- Calculate revenue
            FROM
                "Bundles"
        ) AS b ON names.name = b.name
        GROUP BY
            names.name
    `, { type: QueryTypes.SELECT });

    // Sort the response based on the predefined order
    response.sort((a, b) => orderMap.get(a.name) - orderMap.get(b.name));
    return response;
}

export const ChartController = {
    GetTotalSoldByPriceBarOrPieChartData,
    TotalSoldByPriceScatteredChartData,
    TotalSoldAndRevenueByPriceAreaChartData
};
