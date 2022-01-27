import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {AngularMaterialModule} from "../angular-material.module";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {AnalysisListComponent} from "./analysis-list/analysis-list.component";

@NgModule({
  declarations: [
    AnalysisListComponent
  ],
  imports: [
    // this one we need to use ngModule
    FormsModule,
    AngularMaterialModule,
    CommonModule,
    RouterModule
  ]

})
export class AnalysisModule {}
