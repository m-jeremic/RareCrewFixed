import { NgModule } from "@angular/core";
import { Repository } from "./repository.model";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    imports: [HttpClientModule],
    providers: [Repository]
})
export class ModelModule {

}
