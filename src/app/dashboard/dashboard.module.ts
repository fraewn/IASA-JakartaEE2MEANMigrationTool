import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {AngularMaterialModule} from "../angular-material.module";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import { MatTableModule } from '@angular/material/table'
import {MatSortModule} from "@angular/material/sort";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTabsModule} from "@angular/material/tabs";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MPSComponent} from "./migrationprocessstep/mps.component";
import {MatListModule} from "@angular/material/list";
import {MatDividerModule} from "@angular/material/divider";

@NgModule({
  declarations: [
    MPSComponent
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
    MatTabsModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule

  ]

})
export class DashboardModule {}
