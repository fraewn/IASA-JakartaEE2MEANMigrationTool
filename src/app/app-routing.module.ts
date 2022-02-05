import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportListComponent} from "./reports/report-list/report-list.component";
import {ReportCreateComponent} from "./reports/report-create/report-create.component";
import {AuthGuard} from "./auth/auth.guard";
import {CompanyCreateComponent} from "./companies/company-create/company-create.component";
import {CompanyListComponent} from "./companies/company-list/company-list.component";
import {FailureComponent} from "./failure/failure.component";
import {RoleGuard} from "./permission/role.guard";
import {AnalysisTableComponent} from "./globalAnalysis/analysisTable/analysis-table.component";
import {SemanticAnalysisComponent} from "./localAnalysis/semanticAnalysis/semantic-analysis.component";
import {EditKeywordsComponent} from "./localAnalysis/keywords/edit-keywords.component";
import {OntologyComponent} from "./localAnalysis/ontology/ontology-component";
import {MPSComponent} from "./dashboard/migrationprocessstep/mps.component";
import {EntitySplittingProfilingComponent} from "./localAnalysis/entity-splitting/entitySplittingProfiling/entity-splitting-profiling.component";
import {EntitySplittingComponent} from "./localAnalysis/entity-splitting/entitySplitting/entity-splitting.component";

const routes: Routes = [
  { path: '', component: ReportListComponent },
  { path: 'company', component: CompanyListComponent},
  { path: 'globalAnalysis', component: AnalysisTableComponent},
  { path: 'semanticAnalysis', component: SemanticAnalysisComponent},
  { path: 'editKeywords', component: EditKeywordsComponent},
  { path: 'dashboard', component: MPSComponent},
  { path: 'splitting/entity/profiling', component: EntitySplittingProfilingComponent},
  { path: 'splitting/entity/result', component: EntitySplittingComponent},
  { path: 'semanticAnalysis/ontology', component: OntologyComponent},
  { path: 'failure', component: FailureComponent},
  { path: 'report/create', component: ReportCreateComponent, canActivate: [AuthGuard]},
  { path: 'report/edit/:reportId', component: ReportCreateComponent, canActivate: [AuthGuard]},
  { path: 'company/create', component: CompanyCreateComponent, canActivate: [AuthGuard, RoleGuard], data : {permissionTypes : ['CREATE_COMPANY']}},
  { path: 'company/edit/:companyId', component: CompanyCreateComponent, canActivate: [AuthGuard]},
  // in load children you can describe the path you want to load lazily
  // old syntax: load Children: './auth/auth.module#AuthModule'
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, RoleGuard]
})
export class AppRoutingModule { }
