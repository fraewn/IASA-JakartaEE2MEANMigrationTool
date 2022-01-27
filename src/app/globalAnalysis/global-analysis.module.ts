import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {AngularMaterialModule} from "../angular-material.module";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {AnalysisTableComponent} from "./analysisTable/analysis-table.component";
import { MatTableModule } from '@angular/material/table'
import {MatSortModule} from "@angular/material/sort";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTabsModule} from "@angular/material/tabs";

@NgModule({
  declarations: [
    AnalysisTableComponent
  ],
  imports: [
    // this one we need to use ngModule
    FormsModule,
    AngularMaterialModule,
    CommonModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatTabsModule
  ]

})
export class GlobalAnalysisModule {}
