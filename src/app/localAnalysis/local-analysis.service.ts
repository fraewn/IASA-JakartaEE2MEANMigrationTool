import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";
import {SemanticKnowledge} from "./local-analysis.model";


@Injectable({providedIn: 'root'})
export class LocalAnalysisService{
  private semanticKnowledge : SemanticKnowledge[]
  private BACKEND_URL_SEMANTICANALYSIS = environment.backend + "/semanticAnalysis";


  constructor(private http: HttpClient, private router: Router) {}

  requestSemanticAnalysisResults() {
    this.http.get<{ message: string, semanticKnowledgeIncoming: any, maxReports: number }>(
      this.BACKEND_URL_SEMANTICANALYSIS)
      // allows us to manipulate observed data
      .pipe(
        map(semanticKnowledgeData => {
          return {
            semanticKnowledge: semanticKnowledgeData.semanticKnowledgeIncoming.map(instance => {
              return {
                id: instance.id,
                name: instance.name,
                keywords: instance.keywords
              };
            }),
          }
        })).subscribe((transformedData) => {
          this.semanticKnowledge = transformedData.semanticKnowledge;
    });
  }


}
