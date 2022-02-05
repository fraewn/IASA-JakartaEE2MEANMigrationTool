import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";
import {Subject} from "rxjs";
import {NodeKnowledge} from "./global-analysis.model";
import {JavaEEComponents} from "./analysisTable/analysis-table.component";
import {mainDiagnosticsForTest} from "@angular/compiler-cli/src/main";

@Injectable({providedIn: 'root'})
export class GlobalAnalysisService {
  private nodeKnowledgeUpdated = new Subject<{ nodeKnowledge: NodeKnowledge[] }>();
  private javaEEComponentsUpdated = new Subject<{ javaEEComponents: JavaEEComponents[] }>();

  private BACKEND_URL_REQUEST_GLOBAL_ANALYSIS = environment.backend + "/globalAnalyses";
  private BACKEND_URL_REQUEST_ANALYSIS_RESULTS = environment.backend + "/globalAnalyses/knowledge";
  private BACKEND_URL_REQUEST_JAVAEECOMPONENTS = environment.backend + "/ontologyKnowledge/javaEEcomponents"
  private BACKEND_URL_REQUEST_UPDATE_JAVAEECOMPONENT = environment.backend + "/nodeKnowledge/addJavaEEComponent"
  private BACKEND_URL_REQUEST_DELETE_JAVAEECOMPONENT = environment.backend + "/nodeKnowledge/deleteJavaEEComponent"

  constructor(private http: HttpClient, private router: Router) {
  }

  navigateToKeywordView(){
    this.router.navigate(["/editKeywords"]);
  }

  navigateToEditOntologyView(){
    this.router.navigate(["/semanticAnalysis/ontology"]);
  }

  requestDeleteJavaEEComponent(name, javaEEComponent){
    const queryParams = `?javaEEComponent=${javaEEComponent}&name=${name}`;
    this.http.get(
      this.BACKEND_URL_REQUEST_DELETE_JAVAEECOMPONENT + queryParams).pipe(map(response => ({
      nodeKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedNodeKnowledgeData: NodeKnowledge[] = [];
      for (let i in objectArr.nodeKnowledgeObjectArray) {
        let nodeKnowledgeInstance: NodeKnowledge = {
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
          name: "",
          keywords: []
        };
        nodeKnowledgeInstance.name = objectArr.nodeKnowledgeObjectArray[i].name;
        nodeKnowledgeInstance.label = objectArr.nodeKnowledgeObjectArray[i].label;
        nodeKnowledgeInstance.triangleScore = objectArr.nodeKnowledgeObjectArray[i].triangleScore;
        nodeKnowledgeInstance.triangleCoefficientScore = objectArr.nodeKnowledgeObjectArray[i].triangleCoefficientScore;
        nodeKnowledgeInstance.betweennessCentralityScore = objectArr.nodeKnowledgeObjectArray[i].betweennessCentralityScore;
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
      this.nodeKnowledgeUpdated.next({nodeKnowledge: transformedNodeKnowledgeData});
    });
  }

  requestUpdateJavaEEComponent(name, javaEEComponent){
    const queryParams = `?javaEEComponent=${javaEEComponent}&name=${name}`;
    this.http.get(
      this.BACKEND_URL_REQUEST_UPDATE_JAVAEECOMPONENT + queryParams).pipe(map(response => ({
      nodeKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedNodeKnowledgeData: NodeKnowledge[] = [];
      for (let i in objectArr.nodeKnowledgeObjectArray) {
        let nodeKnowledgeInstance: NodeKnowledge = {
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
          name: "",
          keywords: []
        };
        nodeKnowledgeInstance.name = objectArr.nodeKnowledgeObjectArray[i].name;
        nodeKnowledgeInstance.label = objectArr.nodeKnowledgeObjectArray[i].label;
        nodeKnowledgeInstance.triangleScore = objectArr.nodeKnowledgeObjectArray[i].triangleScore;
        nodeKnowledgeInstance.triangleCoefficientScore = objectArr.nodeKnowledgeObjectArray[i].triangleCoefficientScore;
        nodeKnowledgeInstance.betweennessCentralityScore = objectArr.nodeKnowledgeObjectArray[i].betweennessCentralityScore;
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
      this.nodeKnowledgeUpdated.next({nodeKnowledge: transformedNodeKnowledgeData});
    });
  }



  requestCurrentGlobalKnowledge()
  {
    this.http.get(
      this.BACKEND_URL_REQUEST_ANALYSIS_RESULTS).pipe(map(response => ({
      nodeKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedNodeKnowledgeData: NodeKnowledge[] = [];
      for (let i in objectArr.nodeKnowledgeObjectArray) {
        let nodeKnowledgeInstance: NodeKnowledge = {
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
          name: "",
          keywords: []
        };
        nodeKnowledgeInstance.name = objectArr.nodeKnowledgeObjectArray[i].name;
        nodeKnowledgeInstance.label = objectArr.nodeKnowledgeObjectArray[i].label;
        nodeKnowledgeInstance.triangleScore = objectArr.nodeKnowledgeObjectArray[i].triangleScore;
        nodeKnowledgeInstance.triangleCoefficientScore = objectArr.nodeKnowledgeObjectArray[i].triangleCoefficientScore;
        nodeKnowledgeInstance.betweennessCentralityScore = objectArr.nodeKnowledgeObjectArray[i].betweennessCentralityScore;
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
      this.nodeKnowledgeUpdated.next({nodeKnowledge: transformedNodeKnowledgeData});
    });
}

  requestExecuteGlobalAnalysis(){
    this.http.get(this.BACKEND_URL_REQUEST_GLOBAL_ANALYSIS).subscribe(res => {
      console.log(res);
    });
  }

  getNodeKnowledgeUpdateListener(){
    return this.nodeKnowledgeUpdated.asObservable();
  }

  getAllJavaEEComponents() {
    this.http.get(
      this.BACKEND_URL_REQUEST_JAVAEECOMPONENTS).pipe(map(response => ({
      javaEEComponent: response
    }))).subscribe(javaEEComponentsList => {
      let list : JavaEEComponents[] = [];
      for(let i in javaEEComponentsList){
        for(let j in javaEEComponentsList[i]){
          let javaEEComponent : JavaEEComponents = {name : ""};
          javaEEComponent.name = javaEEComponentsList[i][j];
          list.push(javaEEComponent);
        }
      }
      this.javaEEComponentsUpdated.next({javaEEComponents : list});
    });
  }

  getJavaEEComponentsUpdateListener(){
    return this.javaEEComponentsUpdated.asObservable();
  }

}
