import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-single-accommodation-analytics',
  templateUrl: './single-accommodation-analytics.component.html',
  styleUrls: ['./single-accommodation-analytics.component.css']
})
export class SingleAccommodationAnalyticsComponent implements OnInit {
  @Input() startDate: string = '';
  @Input() endDate: string = '';
  @Input() accommodationId: number = 1;

  @ViewChild(BaseChartDirective, { static: true }) chart!: BaseChartDirective;
  @ViewChild('leftChart', { static: false }) leftChart!: BaseChartDirective;


  chartType: ChartType;
  chartEarningsData: any[] = [];
  chartReservationsData: any[] = [];
  chartLabels: string[] = [];
  chartData: any[] = [];
  chartOptions: any = {
    responsive: true,
  };
  chartLegend = true;

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService
  ) {
    this.chartType = 'bar';
  }

  ngOnInit(): void {
    this.getAnalytics();
  }

  getAnalytics(): void {
    this.analyticsService.getSingleAnalytics(this.startDate, this.endDate, this.authService.getUserID(), this.accommodationId).subscribe({
      next: (analytics) => {
        console.log(analytics);
  
        const chartData: any[] = [];
  
        analytics.forEach((analytic, index) => {
          chartData.push({
            month: analytic.month,
            profit: analytic.totalEarnings!,
            reservations: analytic.totalReservations!
          });
        });
  
        const uniqueMonths = Array.from(new Set(chartData.map(data => data.month)));
  
        const profitData: number[] = [];
        const reservationsData: number[] = [];
  
        uniqueMonths.forEach(month => {
          const dataForMonth = chartData.find(data => data.month === month);
  
          profitData.push(dataForMonth?.profit || 0);
          reservationsData.push(dataForMonth?.reservations || 0);
        });
  
        this.chartLabels = uniqueMonths;
        this.chartData = [
          { data: profitData, label: 'Profit', backgroundColor: '#037940' },
          { data: reservationsData, label: 'Reservations', backgroundColor: '#bc1823' }
        ];
      },
      error: (error) => {
        console.error('Error fetching analytics data', error);
      },
    });
  }
  
  


  generateChartImages(): { leftChart: string } | undefined {
    if (!this.leftChart || !this.leftChart.chart) {
      return {leftChart:"UNDEFINED"};
    }
  
    const leftChartCanvas = document.createElement('canvas');

    leftChartCanvas.width = 400;
    leftChartCanvas.height = 200;

    const leftChartContext = leftChartCanvas.getContext('2d');

    this.leftChart.chart.draw();

    return {
      leftChart: leftChartCanvas.toDataURL('image/png')
    };
  }
}

