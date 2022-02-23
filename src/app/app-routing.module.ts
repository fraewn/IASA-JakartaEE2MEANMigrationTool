import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AnalysisTableComponent} from "./globalAnalysis/analysisTable/analysis-table.component";
import {SemanticAnalysisComponent} from "./localAnalysis/semanticAnalysis/semantic-analysis.component";
import {EditKeywordsComponent} from "./localAnalysis/keywords/edit-keywords.component";
import {OntologyComponent} from "./localAnalysis/ontology/ontology-component";
import {MPSComponent} from "./dashboard/migrationprocessstep/mps.component";
import {EntitySplittingProfilingComponent} from "./localAnalysis/entity-splitting/entitySplittingProfiling/entity-splitting-profiling.component";
import {EntitySplittingComponent} from "./localAnalysis/entity-splitting/entitySplitting/entity-splitting.component";
import {FuncSplittingComponent} from "./localAnalysis/func-splitting/funcSplitting/func-splitting.component";
import {ModuleIdentComponent} from "./localAnalysis/module-ident/moduleIdent/module-ident.component";

const routes: Routes = [
  { path: '', component: MPSComponent },
  { path: 'globalAnalysis', component: AnalysisTableComponent},
  { path: 'semanticAnalysis', component: SemanticAnalysisComponent},
  { path: 'editKeywords', component: EditKeywordsComponent},
  { path: 'dashboard', component: MPSComponent},
  { path: 'splitting/entity/profiling', component: EntitySplittingProfilingComponent},
  { path: 'splitting/entity/result', component: EntitySplittingComponent},
  { path: 'splitting/functionality/result', component: FuncSplittingComponent},
  { path: 'splitting/moduleIdent', component: ModuleIdentComponent},
  { path: 'semanticAnalysis/ontology', component: OntologyComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
