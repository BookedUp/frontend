import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-yearly-analytics',
  templateUrl: './yearly-analytics.component.html',
  styleUrls: ['./yearly-analytics.component.css'],
})
export class YearlyAnalyticsComponent implements OnInit {
  @Input() startDate: string = '';
  @Input() endDate: string = '';

  @ViewChild(BaseChartDirective, { static: true }) chart!: BaseChartDirective;
  @ViewChild('leftChart', { static: false }) leftChart!: BaseChartDirective;
  @ViewChild('rightChart', { static: false }) rightChart!: BaseChartDirective;


  chartType: ChartType;
  chartEarningsData: any[] = [];
  chartReservationsData: any[] = [];
  chartLabels: string[] = [];
  chartOptions: any = {
    responsive: true,
  };
  chartLegend = true;

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService
  ) {
    this.chartType = 'pie';
  }

  ngOnInit(): void {
    this.getAnalytics();
  }

  getAnalytics(): void {
    this.analyticsService.getAllAnalytics(this.startDate, this.endDate, this.authService.getUserID()).subscribe({
      next: (analytics) => {
        console.log(analytics);
  
        const profit: number[] = [];
        const reservations: number[] = [];
        const labels: string[] = [];
        const chartColors: any[] = ['#037940', '#bc1823', '#0077d8', '#fbbc04', '#f2994a'];
  
        analytics.forEach((analytic, index) => {
          profit.push(analytic.totalEarnings!);
          reservations.push(analytic.totalReservations!);
          labels.push(analytic.name!);
        });
  
        this.chartLabels = labels;
        this.chartEarningsData = [{ data: profit, label: 'Profit', backgroundColor: chartColors }];
        this.chartReservationsData = [{ data: reservations, label: 'Reservations', backgroundColor: chartColors }];
      },
      error: (error) => {
        console.error('Error fetching analytics data', error);
      },
    });
  }


  generateChartImages(): { leftChart: string, rightChart: string } | undefined {
    if (!this.leftChart || !this.rightChart || !this.leftChart.chart || !this.rightChart.chart) {
      return {leftChart:"UNDEFINED", rightChart:"UNDEFINED"};
    }
  
    const leftChartCanvas = document.createElement('canvas');
    const rightChartCanvas = document.createElement('canvas');

    leftChartCanvas.width = 400;
    leftChartCanvas.height = 200;

    rightChartCanvas.width = 400;
    rightChartCanvas.height = 200;

    const leftChartContext = leftChartCanvas.getContext('2d');
    const rightChartContext = rightChartCanvas.getContext('2d');

    this.leftChart.chart.draw();
    this.rightChart.chart.draw();

    return {
      leftChart: leftChartCanvas.toDataURL('image/png'),
      rightChart: rightChartCanvas.toDataURL('image/png')
    };
  }
}

