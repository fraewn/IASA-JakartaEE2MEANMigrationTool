import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";
import {Subject} from "rxjs";
import {NodeKnowledge} from "./global-analysis.model";

@Injectable({providedIn: 'root'})
export class GlobalAnalysisService{
  private nodeKnowledgeUpdated = new Subject<{nodeKnowledge : NodeKnowledge[]}>();

  private BACKEND_URL_REQUEST_GLOBAL_ANALYSIS = environment.backend + "/globalAnalyses";
  private BACKEND_URL_REQUEST_ANALYSIS_RESULTS = environment.backend + "/globalAnalyses/knowledge";

  constructor(private http: HttpClient, private router: Router) {}

  requestCurrentGlobalKnowledge(){
    this.http.get(
      this.BACKEND_URL_REQUEST_ANALYSIS_RESULTS).pipe(map(response => ({
      nodeKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedNodeKnowledgeData : NodeKnowledge[] = [];
      for(let i in objectArr.nodeKnowledgeObjectArray){
        let nodeKnowledgeInstance : NodeKnowledge = {
          associatedLayers: [],
          associatedMeanModuleType: "",
          betweennessCentralityScore: 0,
          calculatedInterpretation: "",
          classIsEntity: false,
          closenessCentralityScore: 0,
          label: [],
          pageRankScore: 0,
          representedEntity: "",
          representedMeanModuleType: "",
          review: false,
          reviewNecessary: false,
          triangleCoefficientScore: 0,
          triangleScore: 0,
          name:"",
          keywords:[]};
        nodeKnowledgeInstance.name = objectArr.nodeKnowledgeObjectArray[i].name;
        nodeKnowledgeInstance.label = objectArr.nodeKnowledgeObjectArray[i].label;
        nodeKnowledgeInstance.triangleScore = objectArr.nodeKnowledgeObjectArray[i].triangleScore;
        nodeKnowledgeInstance.triangleCoefficientScore =  objectArr.nodeKnowledgeObjectArray[i].triangleCoefficientScore;
        nodeKnowledgeInstance.betweennessCentralityScore =  objectArr.nodeKnowledgeObjectArray[i].betweennessCentralityScore;
        nodeKnowledgeInstance.pageRankScore = objectArr.nodeKnowledgeObjectArray[i].pageRankScore;
        nodeKnowledgeInstance.closenessCentralityScore = objectArr.nodeKnowledgeObjectArray[i].closenessCentralityScore;
        nodeKnowledgeInstance.classIsEntity = objectArr.nodeKnowledgeObjectArray[i].classIsEntity;
        nodeKnowledgeInstance.representedEntity = objectArr.nodeKnowledgeObjectArray[i].representedEntity;
        nodeKnowledgeInstance.keywords = objectArr.nodeKnowledgeObjectArray[i].keywords;
        nodeKnowledgeInstance.associatedLayers = objectArr.nodeKnowledgeObjectArray[i].associatedLayers;
        nodeKnowledgeInstance.calculatedInterpretation = objectArr.nodeKnowledgeObjectArray[i].calculatedInterpretation;
        nodeKnowledgeInstance.reviewNecessary = objectArr.nodeKnowledgeObjectArray[i].reviewNecessary;
        nodeKnowledgeInstance.review = objectArr.nodeKnowledgeObjectArray[i].review;
        nodeKnowledgeInstance.representedMeanModuleType = objectArr.nodeKnowledgeObjectArray[i].representedMeanModuleType;
        nodeKnowledgeInstance.associatedMeanModuleType = objectArr.nodeKnowledgeObjectArray[i].associatedMeanModuleType;
        transformedNodeKnowledgeData.push(nodeKnowledgeInstance);
      }
      this.nodeKnowledgeUpdated.next({nodeKnowledge : transformedNodeKnowledgeData });
    });
  }

  getNodeKnowledgeUpdateListener(){
    return this.nodeKnowledgeUpdated.asObservable();
  }
}
