import {Injectable, Input} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";
import {SemanticKnowledge} from "./local-analysis.model";
import {Subject} from "rxjs";


@Injectable({providedIn: 'root'})
export class LocalAnalysisService{


  private semanticKnowledge : SemanticKnowledge[] = [];
  private semanticKnowledgeUpdated = new Subject<{semanticKnowledge : SemanticKnowledge[]}>();
  private BACKEND_URL_SEMANTICANALYSIS = environment.backend + "/semanticAnalysis";

  constructor(private http: HttpClient, private router: Router) {}

  requestSemanticAnalysisResults() {
    let semanticKnowledgeObjectArray;
    this.http.get(
      this.BACKEND_URL_SEMANTICANALYSIS).pipe(map(response => ({
      semanticKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedSemanticKnowledgeData : SemanticKnowledge[] = [];
      console.log(objectArr);
      console.log(objectArr.semanticKnowledgeObjectArray);
      for(let i in objectArr.semanticKnowledgeObjectArray){
        console.log(objectArr.semanticKnowledgeObjectArray[i].name);
        let semanticKnowledge : SemanticKnowledge = {name:"", keywords:[]};
        semanticKnowledge.name = objectArr.semanticKnowledgeObjectArray[i].name;
        semanticKnowledge.keywords = objectArr.semanticKnowledgeObjectArray[i].keywords;
        transformedSemanticKnowledgeData.push(semanticKnowledge);
      }
      console.log(transformedSemanticKnowledgeData);
      this.semanticKnowledgeUpdated.next({semanticKnowledge : transformedSemanticKnowledgeData });
    });




      // allows us to manipulate observed data
      /*.pipe(
        map(semanticKnowledgeData => {
          console.log(semanticKnowledgeData);
          return {
            semanticKnowledgeInstances: semanticKnowledgeData.semanticKnowledgeIncoming.iterate(instance => {
              return {
                name : instance.name,
                keywords : instance.keywords
              }
            })
          };
        })).subscribe((transformedData) => {
          this.semanticKnowledge = transformedData.semanticKnowledgeInstances;
    });*/
  }

  getSemanticKnowledgeUpdateListener(){
    return this.semanticKnowledgeUpdated.asObservable();
  }



}
