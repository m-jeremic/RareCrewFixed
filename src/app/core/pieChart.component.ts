import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartDataset, ChartOptions, ChartTypeRegistry } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { EmployeeUrl } from '../model/employeeUrl.model';
import { Employee } from '../model/employee.model';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const dataUrl = 'https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';

@Component({
    selector: "pie-chart",
    templateUrl: "pieChart.component.html"
})
export class PieChartComponent implements OnInit, OnDestroy {

    @ViewChild(BaseChartDirective) chart: BaseChartDirective;  // tsconfig.json: angularCompilerOptions: { ..., "strictPropertyInitialization": false}
    private sub: Subscription;

    public chartData: ChartDataset[] = [{ 
        data: [10 , 5, 15, 25], 
        backgroundColor: [
          'rgb(235,78,130)', 'rgb(78,167,235)', 'rgb(78,235,167)', 'rgb(156,235,78)', 
          'rgb(235,183,78)', 'rgb(232,171,130)', 'rgb(219,151,208)', 'rgb(182,220,186)', 
          'rgb(214,242,35)', 'rgb(128,141,222)', 'rgb(192,192,192)'
        ]              
      }
    ];
    public labels: string[] = ['jan', 'feb', 'mar', 'apr'];
    public options: ChartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                align: 'center',
            },
            datalabels: {
                formatter: (value, ctx) => {
                    let sum = 0;
                    let dataArray: any[] = ctx.chart.data.datasets[0].data;
                    dataArray.map((data: number) => sum += data);
                    let percentage = Math.floor(value * 100 / sum) + "%";
                    return percentage;
                }
            }
        }
    }


    public employees: Employee[] = [];
    public employees2: Employee[] = [];
    public names: string[] = [];
    public values: number[] = [];
    
    constructor(private http: HttpClient) {
        Chart.register(ChartDataLabels);
    }

    ngOnInit(): void {
        this.sub = this.http.get<EmployeeUrl[]>(dataUrl).subscribe(data => {
            data.forEach(emp => {
              return this.employees.push(new Employee(emp.Id, emp.EmployeeName, this.getTotalHours(emp)));
      
            });
            this.employees.forEach(emp => {
                if(!this.employees2.some((element) => element.name == emp.name || element.name == 'Unknown')) {
                        this.employees2.push(new Employee(emp.id, (emp.name ? emp.name: 'Unknown'), emp.totalTime));             
                } else {               
                    let index = this.employees2.findIndex((element) => element.name == emp.name || element.name == 'Unknown');
                    let newEmployee = new Employee(emp.id, emp.name, Math.floor(emp.totalTime + this.employees2[index].totalTime));
                    this.employees2.splice(index, 1, newEmployee);
                }
            });
            this.employees2.forEach(emp => {
              this.names.push(emp.name);
              this.values.push(emp.totalTime);
            })
            this.chartData[0].data = this.values;
            this.labels = this.names;
            this.chart.update();
          });
    }  
    
    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    getTotalHours(data: EmployeeUrl): number {
        let endTime = new Date(data.EndTimeUtc);
        let startTime = new Date(data.StarTimeUtc);
        let difference = endTime.valueOf() - startTime.valueOf();
        let diffInHours = difference / (1000*60*60); // from milliseconds to hours
        return diffInHours;       
    }


}