import { Component } from 'react';

import styles from './dashboard.module.scss';
import { GridstackGrid, GridstackItemComponent, GridstackProvider } from '../grid';
import { cloneDeep } from 'lodash';
import { defaultGridStackNode, defaultGridStackOptions } from './types/constants';
import 'gridstack/dist/gridstack.css';
import 'gridstack/dist/gridstack-extra.css';
import PieChart from './components/pie-chart/pie-chart';
import { I18nContext } from 'react-i18next';
import BarChart from './components/bar-chart/bar-chart';
import ScatteredChart from './components/scattered-chart/scattered-chart';
import AreaChart from './components/area-chart/area-chart';
import { DashboardProps, DashboardState } from './types/interfaces';
import { DashboardRepository } from './repositories';
import { SubscriptionLike } from 'rxjs';
import BundleTable from './components/bundle-table/bundle-table';

export class Dashboard extends Component<DashboardProps, DashboardState> {
  private dashboardRepository: DashboardRepository;
  private subscriptions: SubscriptionLike[];
  constructor(props: DashboardProps) {
    super(props);
    this.dashboardRepository = new DashboardRepository(props.client);
    this.subscriptions = [];
    this.state = {
      totalSoldVsPriceRangePieChartData: {
        isLoading: false,
        data: []
      },
      totalSoldVsPriceRangeBarChartData: {
        isLoading: false,
        data: []
      },
      totalSoldVsPriceVsRevenueScatteredChartData: {
        isLoading: false,
        data: []
      },
      totalSoldVsRevenueVSPriceAreaChartData: {
        data: [],
        isLoading: false
      }
    }
    this.fetchChartData = this.fetchChartData.bind(this);
    this.fetchTotalSoldVsPriceRangePieChartData = this.fetchTotalSoldVsPriceRangePieChartData.bind(this);
    this.fetchTotalSoldVsPriceRangeBarChartData = this.fetchTotalSoldVsPriceRangeBarChartData.bind(this);
    this.fetchTotalSoldVsPriceVsRevenueScatteredChartData = this.fetchTotalSoldVsPriceVsRevenueScatteredChartData.bind(this);
    this.fetchTotalSoldVsRevenueVSPriceAreaChartData = this.fetchTotalSoldVsRevenueVSPriceAreaChartData.bind(this);
  }

  fetchTotalSoldVsPriceRangePieChartData() {
    const self = this;
    self.setState({ totalSoldVsPriceRangePieChartData: { data: [], isLoading: true } });
    this.subscriptions.push(
      this.dashboardRepository.getTotalSoldByPriceBarChartOrPieChartData()
        .subscribe({
          next(value) {
            if (value) {
              self.setState({ totalSoldVsPriceRangePieChartData: { data: value.GetTotalSoldByPriceBarOrPieChartData, isLoading: false } });
            } else {
              self.setState({ totalSoldVsPriceRangePieChartData: { data: [], isLoading: false } });
              self.props.showNotification({
                message: 'Error Fetching Data!',
                severity: 'error'
              });
            }
          },
          error(errorValue) {
            self.props.showNotification({
              message: errorValue,
              severity: 'error'
            });
          },
        })
    );
  }

  fetchTotalSoldVsPriceRangeBarChartData() {
    const self = this;
    self.setState({ totalSoldVsPriceRangeBarChartData: { data: [], isLoading: true } });
    this.subscriptions.push(
      this.dashboardRepository.getTotalSoldByPriceBarChartOrPieChartData()
        .subscribe({
          next(value) {
            if (value) {
              self.setState({ totalSoldVsPriceRangeBarChartData: { data: value.GetTotalSoldByPriceBarOrPieChartData, isLoading: false } });
            } else {
              self.setState({ totalSoldVsPriceRangeBarChartData: { data: [], isLoading: false } });
              self.props.showNotification({
                message: 'Error Fetching Data!',
                severity: 'error'
              });
            }
          },
          error(errorValue) {
            self.props.showNotification({
              message: errorValue,
              severity: 'error'
            });
          },
        })
    );
  }

  fetchTotalSoldVsPriceVsRevenueScatteredChartData() {
    const self = this;
    self.setState({ totalSoldVsPriceVsRevenueScatteredChartData: { data: [], isLoading: true } });
    this.subscriptions.push(
      this.dashboardRepository.getTotalSoldByPriceScatteredChartData()
        .subscribe({
          next(value) {
            if (value) {
              self.setState({ totalSoldVsPriceVsRevenueScatteredChartData: { data: value.GetTotalSoldByPriceScatteredChartData, isLoading: false } });
            } else {
              self.setState({ totalSoldVsPriceVsRevenueScatteredChartData: { data: [], isLoading: false } });
              self.props.showNotification({
                message: 'Error Fetching Data!',
                severity: 'error'
              });
            }
          },
          error(errorValue) {
            self.props.showNotification({
              message: errorValue,
              severity: 'error'
            });
          },
        })
    );
  }

  fetchTotalSoldVsRevenueVSPriceAreaChartData() {
    const self = this;
    self.setState({ totalSoldVsRevenueVSPriceAreaChartData: { data: [], isLoading: true } });
    this.subscriptions.push(
      this.dashboardRepository.getTotalSoldAndRevenueByPriceAreaChartData()
        .subscribe({
          next(value) {
            if (value) {
              self.setState({ totalSoldVsRevenueVSPriceAreaChartData: { data: value.GetTotalSoldAndRevenueByPriceAreaChartData, isLoading: false } });
            } else {
              self.setState({ totalSoldVsRevenueVSPriceAreaChartData: { data: [], isLoading: false } });
              self.props.showNotification({
                message: 'Error Fetching Data!',
                severity: 'error'
              });
            }
          },
          error(errorValue) {
            self.props.showNotification({
              message: errorValue,
              severity: 'error'
            });
          },
        })
    );
  }

  fetchChartData() {
    this.fetchTotalSoldVsPriceRangePieChartData();
    this.fetchTotalSoldVsPriceRangeBarChartData(); // fetch two times to get different color
    this.fetchTotalSoldVsPriceVsRevenueScatteredChartData();
    this.fetchTotalSoldVsRevenueVSPriceAreaChartData();
  }

  override componentDidMount(): void {
    this.fetchChartData();
  }

  override componentWillUnmount(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }

  override render() {
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <GridstackProvider>
            <div className={styles['container']}>
              <div className="grid-stack-container">
                <GridstackGrid options={cloneDeep(defaultGridStackOptions)}>
                  <GridstackItemComponent className={styles['chart-container']} id={'total-sold-by-price-pie-chart'} initOptions={cloneDeep(defaultGridStackNode)}>
                    <div className={styles['content']}>
                      <div className={styles['title']}>{i18n.t('DASHBOARD.CHART.TOTAL_SOLD_BY_PRICE_RANGE_PIE')}</div>
                      <div className={styles['chart-section']}>
                        <PieChart dataKey={'total_sold'} data={this.state.totalSoldVsPriceRangePieChartData.data} />
                        <div className={styles['legend']}>
                          {this.state.totalSoldVsPriceRangePieChartData.data.map((value, index) => (
                            <div key={index} className={styles['legend-item']}>
                              <div className={styles['legend-icon']} style={{ background: value.fill }}></div>
                              <div className={styles['legend-label']}>{value.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GridstackItemComponent>
                  <GridstackItemComponent className={styles['chart-container']} id={'total-sold-by-price-bar-chart'} initOptions={cloneDeep(defaultGridStackNode)}>
                    <div className={styles['content']}>
                      <div className={styles['title']}>{i18n.t('DASHBOARD.CHART.TOTAL_SOLD_BY_PRICE_RANGE_BAR')}</div>
                      <BarChart datai18nKey={'DASHBOARD.CHART.LABEL.TOTAL_SOLD'} dataKey={'total_sold'} data={this.state.totalSoldVsPriceRangeBarChartData.data} />
                    </div>
                  </GridstackItemComponent>
                  <GridstackItemComponent className={styles['chart-container']} id={'total-sold-by-price-scattered-chart'} initOptions={cloneDeep(defaultGridStackNode)}>
                    <div className={styles['content']}>
                      <div className={styles['title']}>{i18n.t('DASHBOARD.CHART.TOTAL_SOLD_BY_PRICE_RANGE_BY_REVENUE')}</div>
                      <ScatteredChart
                        xDataKey='total_sold'
                        yDataKey='bundle_price'
                        zDatakey='revenue'
                        xDatai18nKey='DASHBOARD.CHART.LABEL.TOTAL_SOLD'
                        yDatai18nKey='DASHBOARD.CHART.LABEL.BUNDLE_PRICE'
                        zDatai18nKey='DASHBOARD.CHART.LABEL.REVENUE'
                        data={this.state.totalSoldVsPriceVsRevenueScatteredChartData.data}
                      />
                    </div>
                  </GridstackItemComponent>
                  <GridstackItemComponent className={styles['chart-container']} id={'total-sold-and-revenue-by-price-area-chart'} initOptions={cloneDeep(defaultGridStackNode)}>
                    <div className={styles['content']}>
                      <div className={styles['title']}>{i18n.t('DASHBOARD.CHART.TOTAL_SOLD_VS_REVENUE_BY_PRICE_RANGE_AREA_CHART')}</div>
                      <AreaChart
                        xDataKey='total_sold'
                        yDataKey='revenue'
                        xDatai18nKey='DASHBOARD.CHART.LABEL.TOTAL_SOLD'
                        yDatai18nKey='DASHBOARD.CHART.LABEL.REVENUE'
                        data={this.state.totalSoldVsRevenueVSPriceAreaChartData.data}
                      />
                    </div>
                  </GridstackItemComponent>
                </GridstackGrid>
              </div>
              <div className={styles['table-container']}>
                <BundleTable fetchCharts={this.fetchChartData} />
              </div>
            </div>
          </GridstackProvider>
        )}
      </I18nContext.Consumer>

    );
  }
}
