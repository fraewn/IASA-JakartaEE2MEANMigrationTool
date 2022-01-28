import {Injectable, Input} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";
import {SemanticKnowledge} from "./local-analysis.model";
import {Subject} from "rxjs";


@Injectable({providedIn: 'root'})
export class LocalAnalysisService{


  private semanticKnowledge : SemanticKnowledge[] = [];
  private semanticKnowledgeUpdated = new Subject<{semanticKnowledge : SemanticKnowledge[]}>();
  private BACKEND_URL_SEMANTICANALYSIS = environment.backend + "/semanticAnalysis";
  private BACKEND_URL_CURRENT_SEMANTIC_KNOWLEDGE = environment.backend + "/semanticAnalysis/current";
  private BACKEND_URL_CURRENT_SEMANTIC_ANALYSIS_PER_LAYER = environment.backend + "/semanticAnalysisForOneLayer";

  constructor(private http: HttpClient, private router: Router) {}

  requestSemanticAnalysisResults() {
    this.http.get(
      this.BACKEND_URL_SEMANTICANALYSIS).pipe(map(response => ({
      semanticKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedSemanticKnowledgeData : SemanticKnowledge[] = [];
      for(let i in objectArr.semanticKnowledgeObjectArray){
        let semanticKnowledge : SemanticKnowledge = {name:"", keywords:[]};
        semanticKnowledge.name = objectArr.semanticKnowledgeObjectArray[i].name;
        semanticKnowledge.keywords = objectArr.semanticKnowledgeObjectArray[i].keywords;
        transformedSemanticKnowledgeData.push(semanticKnowledge);
      }
      this.semanticKnowledgeUpdated.next({semanticKnowledge : transformedSemanticKnowledgeData });
    });
  }

  requestSemanticAnalysisForALayerResult(layer, semanticAnalysisExtensions) {
    const headers = new HttpHeaders().append('Content-Type', 'application/json')
    const body = JSON.stringify(semanticAnalysisExtensions);
    const params = new HttpParams().append("layer", layer);
    this.http.post(
      this.BACKEND_URL_CURRENT_SEMANTIC_ANALYSIS_PER_LAYER, body, {
        headers: headers,
        params: params
      }).pipe(map(response => ({
      semanticKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedSemanticKnowledgeData : SemanticKnowledge[] = [];
      for(let i in objectArr.semanticKnowledgeObjectArray){
        let semanticKnowledge : SemanticKnowledge = {name:"", keywords:[]};
        semanticKnowledge.name = objectArr.semanticKnowledgeObjectArray[i].name;
        semanticKnowledge.keywords = objectArr.semanticKnowledgeObjectArray[i].keywords;
        transformedSemanticKnowledgeData.push(semanticKnowledge);
      }
      this.semanticKnowledgeUpdated.next({semanticKnowledge : transformedSemanticKnowledgeData });
    });
  }

  requestCurrentSemanticKnowledge(){
    this.http.get(
      this.BACKEND_URL_CURRENT_SEMANTIC_KNOWLEDGE).pipe(map(response => ({
      semanticKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedSemanticKnowledgeData : SemanticKnowledge[] = [];
      for(let i in objectArr.semanticKnowledgeObjectArray){
        let semanticKnowledge : SemanticKnowledge = {name:"", keywords:[]};
        semanticKnowledge.name = objectArr.semanticKnowledgeObjectArray[i].name;
        semanticKnowledge.keywords = objectArr.semanticKnowledgeObjectArray[i].keywords;
        transformedSemanticKnowledgeData.push(semanticKnowledge);
      }
      this.semanticKnowledgeUpdated.next({semanticKnowledge : transformedSemanticKnowledgeData });
    });
  }

  getSemanticKnowledgeUpdateListener(){
    return this.semanticKnowledgeUpdated.asObservable();
  }



}
