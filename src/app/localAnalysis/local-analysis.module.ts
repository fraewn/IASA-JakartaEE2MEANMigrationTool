import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AngularMaterialModule} from "../angular-material.module";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import { MatTableModule } from '@angular/material/table'
import {MatSortModule} from "@angular/material/sort";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTabsModule} from "@angular/material/tabs";
import {SemanticAnalysisComponent} from "./semanticAnalysis/semantic-analysis.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {EditKeywordsComponent} from "./keywords/edit-keywords.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatAutocomplete, MatAutocompleteModule} from "@angular/material/autocomplete";
import {OntologyComponent} from "./ontology/ontology-component";
import {EntitySplittingProfilingComponent} from "./entity-splitting/entitySplittingProfiling/entity-splitting-profiling.component";
import {EntitySplittingComponent} from "./entity-splitting/entitySplitting/entity-splitting.component";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import {FuncSplittingComponent} from "./func-splitting/funcSplitting/func-splitting.component";
import {ModuleIdentComponent} from "./module-ident/moduleIdent/module-ident.component";

@NgModule({
  declarations: [
    SemanticAnalysisComponent,
    EditKeywordsComponent,
    OntologyComponent,
    EntitySplittingProfilingComponent,
    EntitySplittingComponent,
    FuncSplittingComponent,
    ModuleIdentComponent
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
    MatSlideToggleModule,
    MatOptionModule,
    MatSelectModule,
    DragDropModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule
  ]

})
export class LocalAnalysisModule {}
