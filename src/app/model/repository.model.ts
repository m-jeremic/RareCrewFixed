import { Injectable } from "@angular/core";
import { Employee } from "./employee.model";
import { EmployeeUrl } from "./employeeUrl.model";
import { HttpClient } from "@angular/common/http";

const dataUrl = 'https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';

@Injectable()
export class Repository {

    employeesUrl: EmployeeUrl[];
    employees: Employee[];
    employees2: Employee[];// group by name, and sum total hours

    constructor(private http: HttpClient) {
        this.employeesUrl = new Array<EmployeeUrl>();
        this.employees = new Array<Employee>();
        this.employees2 = new Array<Employee>();
        this.getEmployees();
     }

    getEmployees(){
        this.http.get<EmployeeUrl[]>(dataUrl).subscribe(data => {
            this.employeesUrl = data;
            this.employeesUrl.forEach(emp => {
                this.employees.push(new Employee(emp.Id, emp.EmployeeName, this.getTotalHours(emp)));
            })
            this.employees.forEach(emp => {
                if(!this.employees2.some((element) => element.name == emp.name || element.name == 'Unknown')) {
                        this.employees2.push(new Employee(emp.id, (emp.name ? emp.name: 'Unknown'), emp.totalTime));             
                } else {               
                    let index = this.employees2.findIndex((element) => element.name == emp.name || element.name == 'Unknown');
                    let newEmployee = new Employee(emp.id, emp.name, Math.floor(emp.totalTime + this.employees2[index].totalTime));
                    this.employees2.splice(index, 1, newEmployee);
                }
            });

        });

    }

    getTotalHours(data: EmployeeUrl): number {
        let endTime = new Date(data.EndTimeUtc);
        let startTime = new Date(data.StarTimeUtc);
        let difference = endTime.valueOf() - startTime.valueOf();
        let diffInHours = difference / (1000*60*60); // from milliseconds to hours
        return diffInHours;       
    }

}
