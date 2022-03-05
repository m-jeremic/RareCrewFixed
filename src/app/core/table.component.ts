import { Component } from "@angular/core";
import { Employee } from "../model/employee.model";
import { Repository } from "../model/repository.model";

@Component({
    selector: "paTable",
    templateUrl: "table.component.html"
})
export class TableComponent {

    constructor(private repo: Repository) { }

    get employees(): Employee[] {
       return this.repo.employees2;
    }

}
