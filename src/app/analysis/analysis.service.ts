import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";
import {Analysis} from "./analysis.model";

@Injectable({providedIn: 'root'})
export class AnalysisService {
  private analyses: Analysis[] = [];
  private analysesUpdated = new Subject<{analyses: Analysis[], analysesCount: number}>()
  private BACKEND_URL = environment.backendUrl + "/analyses";

  constructor(private http: HttpClient, private router: Router) {}

  // get all Reports
  getAnalyses(analysesPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${analysesPerPage}&page=${currentPage}`;
    // get analyses from backend
    this.http.get<{message: string, analyses : any, maxAnalyses: number}>(
      this.BACKEND_URL + queryParams)
      // allows us to manipulate observed data
      .pipe(
        map(analysisData => {
          return {
            analyses: analysisData.analyses.map(incomingAnalysis => {
              return {
                title: incomingAnalysis.title,
                value: incomingAnalysis.value
              };
            }),
            maxAnalyses: analysisData.maxAnalyses
          };
        })
      )
      .subscribe((transformedAnalysisData)=> {
        this.analyses = transformedAnalysisData.analyses;
        // js spread operator [...array]
        // creates a new array with [] and makes a copies another array ...array in it
        // otherwise we had only copied the address but not the object (reference type) - in this case we want a real copy
        this.analysesUpdated.next({
          analyses: [...this.analyses],
          analysesCount: transformedAnalysisData.maxAnalyses
        });
      });
  }

  // add a new Report
  addAnalysis(title: string, value: string){
    const analysis: Analysis = {id: null, title:title, value:value};
    // post new report to backend
    this.http.post<{message:string, analysisId:string}>(this.BACKEND_URL, analysis)
      .subscribe((response)=> {
        this.router.navigate(["/"]);
      });
  }

  getAnalysis(reportId: string){
    return this.http.get<{ _id: string; title: string; comment: string; companyName: string,
      date: Date, rating: number, reporterId: string, creator: string }>(
      this.BACKEND_URL + "/" + reportId
    );
  }

  getAnalysisUpdateListener(){
    return this.analysesUpdated.asObservable();
  }

}
