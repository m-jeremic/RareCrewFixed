import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ModelModule } from "../model/model.module";
import { TableComponent } from "./table.component";
import { PieChartComponent } from "./pieChart.component";
import { NgChartsModule } from 'ng2-charts';
import { HttpClientModule } from "@angular/common/http"

@NgModule({
    imports: [BrowserModule, ModelModule, NgChartsModule, HttpClientModule],
    declarations: [TableComponent, PieChartComponent],
    exports: [ModelModule, TableComponent, PieChartComponent],
})
export class CoreModule { }
