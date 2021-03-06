import {Injectable, Input} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";
import {SemanticKnowledge} from "./local-analysis.model";
import {Subject} from "rxjs";
import {OntologyKnowledge} from "./ontology/ontology-component";


@Injectable({providedIn: 'root'})
export class LocalAnalysisService{


  private semanticKnowledgeUpdated = new Subject<{semanticKnowledge : SemanticKnowledge[]}>();
  private ontologyKnowledgeUpdated = new Subject<{ontologyKnowledge : OntologyKnowledge[]}>();

  private BACKEND_URL_SEMANTICANALYSIS = environment.backend + "/semanticAnalysis";
  private BACKEND_URL_CURRENT_SEMANTIC_KNOWLEDGE = environment.backend + "/semanticAnalysis/current";
  private BACKEND_URL_CURRENT_SEMANTIC_ANALYSIS_PER_LAYER = environment.backend + "/semanticAnalysisForOneLayer";
  private BACKEND_URL_CURRENT_SEMANTIC_ANALYSIS_PER_LAYER_EXTENDED = environment.backend + "/semanticAnalysisForOneLayerExtended";
  private BACKEND_URL_SAVE_ALL_PER_LAYER = environment.backend + "/semanticAnalysisSaveAll"
  private BACKEND_URL_DELETE_LAYER = environment.backend + "/semanticAnalysis/deleteLayer"
  private BACKEND_URL_DELETE_KEYWORD_IN_LAYER = environment.backend + "/semanticAnalysis/deleteKeywordInLayer"
  private BACKEND_URL_MOVE_KEYWORD = environment.backend + "/semanticAnalysis/moveKeyword"
  private BACKEND_URL_CURRENT_ONTOLOGY = environment.backend + "/ontologyKnowledge"
  private BACKEND_URL_CURRENT_ONTOLOGY_ASSOCIATE_KEYWORD  = environment.backend + "/ontologyKnowledge/associateKeyword"

  constructor(private http: HttpClient, private router: Router) {}

  navigateToEditKeywordComponent(){
    this.router.navigate(["/editKeywords"]);
  }

  requestCurrentOntologyKnowledge(){
    this.http.get(
      this.BACKEND_URL_CURRENT_ONTOLOGY).pipe(map(response => ({
      entitySplittingProfileArray: response
    }))).subscribe(objectArr => {
      let transformedOntologyKnowledgeData : OntologyKnowledge[] = [];
      for(let i in objectArr.entitySplittingProfileArray){
        let ontologyKnowledge : OntologyKnowledge = {
          associatedKeyword: "",
          description: "",
          javaEEComponent: "",
          layer:""
        };
        ontologyKnowledge.layer = objectArr.entitySplittingProfileArray[i].layer;
        ontologyKnowledge.description = objectArr.entitySplittingProfileArray[i].description;
        ontologyKnowledge.javaEEComponent = objectArr.entitySplittingProfileArray[i].javaEEComponent;
        ontologyKnowledge.associatedKeyword = objectArr.entitySplittingProfileArray[i].associatedKeyword;
        transformedOntologyKnowledgeData.push(ontologyKnowledge);
      }
      this.ontologyKnowledgeUpdated.next({ontologyKnowledge : transformedOntologyKnowledgeData });
    });
  }

  requestAssociateKeyword(javaEEComponent, keyword){
    const queryParams = `?javaEEComponent=${javaEEComponent}&keyword=${keyword}`;
    this.http.get(
      this.BACKEND_URL_CURRENT_ONTOLOGY_ASSOCIATE_KEYWORD + queryParams).pipe(map(response => ({
      entitySplittingProfileArray: response
    }))).subscribe(objectArr => {
      let transformedOntologyKnowledgeData : OntologyKnowledge[] = [];
      for(let i in objectArr.entitySplittingProfileArray){
        let ontologyKnowledge : OntologyKnowledge = {
          associatedKeyword: "",
          description: "",
          javaEEComponent: "",
          layer:""
        };
        ontologyKnowledge.layer = objectArr.entitySplittingProfileArray[i].layer;
        ontologyKnowledge.description = objectArr.entitySplittingProfileArray[i].description;
        ontologyKnowledge.javaEEComponent = objectArr.entitySplittingProfileArray[i].javaEEComponent;
        ontologyKnowledge.associatedKeyword = objectArr.entitySplittingProfileArray[i].associatedKeyword;
        transformedOntologyKnowledgeData.push(ontologyKnowledge);

      }

      this.ontologyKnowledgeUpdated.next({ontologyKnowledge : transformedOntologyKnowledgeData });
      });
  }

  requestMoveKeyword(keyword, oldLayer, newLayer){
    const queryParams = `?oldLayer=${oldLayer}&newLayer=${newLayer}&keyword=${keyword}`;
    this.http.get(
      this.BACKEND_URL_MOVE_KEYWORD + queryParams).pipe(map(response => ({
      nodeKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedSemanticKnowledgeData : SemanticKnowledge[] = [];
      for(let i in objectArr.nodeKnowledgeObjectArray){
        let semanticKnowledge : SemanticKnowledge = {name:"", keywords:[]};
        semanticKnowledge.name = objectArr.nodeKnowledgeObjectArray[i].name;
        semanticKnowledge.keywords = objectArr.nodeKnowledgeObjectArray[i].keywords;
        transformedSemanticKnowledgeData.push(semanticKnowledge);
      }
      this.semanticKnowledgeUpdated.next({semanticKnowledge : transformedSemanticKnowledgeData });
    });
  }

  requestDeleteKeywordFromLayer(layer, keyword){
    const queryParams = `?layer=${layer}&keyword=${keyword}`;
    this.http.delete(
      this.BACKEND_URL_DELETE_KEYWORD_IN_LAYER + queryParams).pipe(map(response => ({
      nodeKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedSemanticKnowledgeData : SemanticKnowledge[] = [];
      for(let i in objectArr.nodeKnowledgeObjectArray){
        let semanticKnowledge : SemanticKnowledge = {name:"", keywords:[]};
        semanticKnowledge.name = objectArr.nodeKnowledgeObjectArray[i].name;
        semanticKnowledge.keywords = objectArr.nodeKnowledgeObjectArray[i].keywords;
        transformedSemanticKnowledgeData.push(semanticKnowledge);
      }
      this.semanticKnowledgeUpdated.next({semanticKnowledge : transformedSemanticKnowledgeData });
    });
  }


  requestSemanticAnalysisResults() {
    this.http.get(
      this.BACKEND_URL_SEMANTICANALYSIS).pipe(map(response => ({
      nodeKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedSemanticKnowledgeData : SemanticKnowledge[] = [];
      for(let i in objectArr.nodeKnowledgeObjectArray){
        let semanticKnowledge : SemanticKnowledge = {name:"", keywords:[]};
        semanticKnowledge.name = objectArr.nodeKnowledgeObjectArray[i].name;
        semanticKnowledge.keywords = objectArr.nodeKnowledgeObjectArray[i].keywords;
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
      nodeKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedSemanticKnowledgeData : SemanticKnowledge[] = [];
      for(let i in objectArr.nodeKnowledgeObjectArray){
        let semanticKnowledge : SemanticKnowledge = {name:"", keywords:[]};
        semanticKnowledge.name = objectArr.nodeKnowledgeObjectArray[i].name;
        semanticKnowledge.keywords = objectArr.nodeKnowledgeObjectArray[i].keywords;
        transformedSemanticKnowledgeData.push(semanticKnowledge);
      }
      this.semanticKnowledgeUpdated.next({semanticKnowledge : transformedSemanticKnowledgeData });
    });
  }

  requestSemanticAnalysisForALayerExtendedResult(layer, semanticAnalysisExtensions) {
    const headers = new HttpHeaders().append('Content-Type', 'application/json')
    const body = JSON.stringify(semanticAnalysisExtensions);
    const params = new HttpParams().append("layer", layer);
    this.http.post(
      this.BACKEND_URL_CURRENT_SEMANTIC_ANALYSIS_PER_LAYER_EXTENDED, body, {
        headers: headers,
        params: params
      }).pipe(map(response => ({
      nodeKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedSemanticKnowledgeData : SemanticKnowledge[] = [];
      for(let i in objectArr.nodeKnowledgeObjectArray){
        let semanticKnowledge : SemanticKnowledge = {name:"", keywords:[]};
        semanticKnowledge.name = objectArr.nodeKnowledgeObjectArray[i].name;
        semanticKnowledge.keywords = objectArr.nodeKnowledgeObjectArray[i].keywords;
        transformedSemanticKnowledgeData.push(semanticKnowledge);
      }
      this.semanticKnowledgeUpdated.next({semanticKnowledge : transformedSemanticKnowledgeData });
    });
  }

  requestCurrentSemanticKnowledge(){
    this.http.get(
      this.BACKEND_URL_CURRENT_SEMANTIC_KNOWLEDGE).pipe(map(response => ({
      nodeKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedSemanticKnowledgeData : SemanticKnowledge[] = [];
      for(let i in objectArr.nodeKnowledgeObjectArray){
        let semanticKnowledge : SemanticKnowledge = {name:"", keywords:[]};
        semanticKnowledge.name = objectArr.nodeKnowledgeObjectArray[i].name;
        semanticKnowledge.keywords = objectArr.nodeKnowledgeObjectArray[i].keywords;
        transformedSemanticKnowledgeData.push(semanticKnowledge);
      }
      this.semanticKnowledgeUpdated.next({semanticKnowledge : transformedSemanticKnowledgeData });
    });
  }

  requestSaveAllPerLayer(layer, semanticAnalysisExtensions) {
    const headers = new HttpHeaders().append('Content-Type', 'application/json')
    const body = JSON.stringify(semanticAnalysisExtensions);
    const params = new HttpParams().append("layer", layer);
    this.http.post(
      this.BACKEND_URL_SAVE_ALL_PER_LAYER, body, {
        headers: headers,
        params: params
      }).pipe(map(response => ({
      nodeKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedSemanticKnowledgeData : SemanticKnowledge[] = [];
      for(let i in objectArr.nodeKnowledgeObjectArray){
        let semanticKnowledge : SemanticKnowledge = {name:"", keywords:[]};
        semanticKnowledge.name = objectArr.nodeKnowledgeObjectArray[i].name;
        semanticKnowledge.keywords = objectArr.nodeKnowledgeObjectArray[i].keywords;
        transformedSemanticKnowledgeData.push(semanticKnowledge);
      }
      this.semanticKnowledgeUpdated.next({semanticKnowledge : transformedSemanticKnowledgeData });
    });
  }

  requestDeleteLayer(layer) {
    const queryParams = `?layer=${layer}`;
    this.http.delete(
      this.BACKEND_URL_DELETE_LAYER + queryParams).pipe(map(response => ({
      nodeKnowledgeObjectArray: response
    }))).subscribe(objectArr => {
      let transformedSemanticKnowledgeData : SemanticKnowledge[] = [];
      for(let i in objectArr.nodeKnowledgeObjectArray){
        let semanticKnowledge : SemanticKnowledge = {name:"", keywords:[]};
        semanticKnowledge.name = objectArr.nodeKnowledgeObjectArray[i].name;
        semanticKnowledge.keywords = objectArr.nodeKnowledgeObjectArray[i].keywords;
        transformedSemanticKnowledgeData.push(semanticKnowledge);
      }
      this.semanticKnowledgeUpdated.next({semanticKnowledge : transformedSemanticKnowledgeData });
    });
  }

  getSemanticKnowledgeUpdateListener(){
    return this.semanticKnowledgeUpdated.asObservable();
  }


  getOntologyKnowledgeUpdateListener() {
    return this.ontologyKnowledgeUpdated.asObservable();
  }
}
