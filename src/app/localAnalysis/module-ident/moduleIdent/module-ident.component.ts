import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {SemanticKnowledge} from "../../local-analysis.model";
import {fromEvent, Observable, Subscription} from "rxjs";
import {LocalAnalysisService} from "../../local-analysis.service";
import {EntitySplittingService} from "../../entity-splitting/entity-splitting.service";
import {FuncSplittingService} from "../../func-splitting/func-splitting.service";
import {SplittingResult} from "../../entity-splitting/entity-splitting.model";
import {ModuleIdentService} from "../module-ident.service";
import {FormControl} from "@angular/forms";
import {MatOption} from "@angular/material/core";
import {NodeKnowledge} from "../../../globalAnalysis/global-analysis.model";
import {GlobalAnalysisService} from "../../../globalAnalysis/global-analysis.service";

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'module-ident-drag-and-drop',
  templateUrl: 'module-ident.component.html',
  styleUrls: ['module-ident.component.css'],
})
export class ModuleIdentComponent implements OnInit, OnDestroy{
  private optionSelected = "";
  nodeKnowledgeNames = [];
  alreadyUsedClasses = [];
  globalAnalysisService : GlobalAnalysisService;
  nodeKnowledge : NodeKnowledge[] = [];
  private nodeKnowledgeSubscribed : Subscription;
  moduleKindOptions = ["Backend Entity Processing", "Backend Feature", "Frontend Entity Processing", "Frontend Feature"];
  myControl = new FormControl();
  localAnalysisService : LocalAnalysisService;
  entitySplittingService : EntitySplittingService;
  funcSplittingService : FuncSplittingService;
  moduleIdentService : ModuleIdentService;
  // model
  entitySplittingResults : SplittingResult[] = [];
  funcSplittingResults : SplittingResult[] = [];
  louvainCluster : SplittingResult[] = [];
  finalSplittingResults : SplittingResult[] = [];
  private splittingResultSubscribed : Subscription;
  private louvainClusterSubscribed : Subscription;
  componentName = "";
  lists = [];

  semanticKnowledge : SemanticKnowledge[] = [];
  private semanticKnowledgeSubscribed : Subscription;

  name="TestTEst";

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  doner = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  constructor(localAnalysisService : LocalAnalysisService, funcSplittingService : FuncSplittingService, entitySplittingService : EntitySplittingService,
              moduleIdentService : ModuleIdentService, globalAnalysisService : GlobalAnalysisService) {
    this.localAnalysisService = localAnalysisService;
    this.funcSplittingService = funcSplittingService;
    this.entitySplittingService = entitySplittingService;
    this.moduleIdentService = moduleIdentService;
    this.globalAnalysisService = globalAnalysisService;
  }

  onCreateGraphArchitecture(){
    this.moduleIdentService.requestCreateArchitecture();
  }

  onDeleteComponent(component){
    console.log(component);
    this.moduleIdentService.deleteModule(component);
  }

  setUpNodeKnowledge(classesUsed){
    this.nodeKnowledgeNames = [];
    let classAlreadyUsed = false;
    for(let i in this.nodeKnowledge){
      for(let j in classesUsed){
        if(this.nodeKnowledge[i].name==classesUsed[j]){
          console.log(classAlreadyUsed);
          classAlreadyUsed=true;
        }
      }
      for(let k in this.nodeKnowledge[i].label){
        if(this.nodeKnowledge[i].label[k]=="Entity" || this.nodeKnowledge[i].label[k]=="Layer" || this.nodeKnowledge[i].label[k]=="Library"){
          classAlreadyUsed = true;
        }
      }
      if(classAlreadyUsed==false) {
        console.log(this.nodeKnowledge[i].name);
        this.nodeKnowledgeNames.push(this.nodeKnowledge[i].name);
      }
      classAlreadyUsed = false;
    }
  }

  onDeleteEntityComponent(base){
    this.entitySplittingService.requestDeleteModule(base);
  }

  onDeleteFuncComponent(base){
    this.funcSplittingService.requestDeleteModule(base);
  }

  createFinalModuleComponent(componentCreationInput){
    let finalSplittingResult : SplittingResult = {base: componentCreationInput.componentName, splittingStrategy: "Manual Assignment", moduleCluster: []};
    this.finalSplittingResults.push(finalSplittingResult);
  }

  test(option : MatOption){
    console.log(option.value);
  }

  saveFinalModuleComponent(cluster){
    console.log(cluster);
    this.moduleIdentService.addFinaleModule(cluster);
  }

  updateModuleComponent(component) {

  }

  onDeleteUsedModule(usedModule, base){
    this.moduleIdentService.requestDeleteCallFromModule(usedModule, base);
  }

  onDuplicateElement(base, element){
    for(let i in this.finalSplittingResults){
      if(base==this.finalSplittingResults[i].base){
        this.finalSplittingResults[i].moduleCluster.push(element);
      }
    }
  }

  onUsedModulesOptionSelected(option: MatOption, splittingResultInstance){
    this.moduleIdentService.requestAddCallToModule(option.value, splittingResultInstance.base);
    window.location.reload();
  }

  onModuleKindOptionSelected(option: MatOption, splittingResultInstance){
    this.moduleIdentService.requestSetKindOfModule(option.value, splittingResultInstance.base);
    window.location.reload();
  }

  createCall(module, calledModule){
    console.log(module);
    console.log(calledModule);
  }

  onDeleteElement(base, element){
    for(let i in this.finalSplittingResults){
      if(base==this.finalSplittingResults[i].base){
        for(let j in this.finalSplittingResults[i].moduleCluster){
          if(element==this.finalSplittingResults[i].moduleCluster[j]){
            this.finalSplittingResults[i].moduleCluster.splice(this.finalSplittingResults[i].moduleCluster.indexOf(j),1);
          }
        }
      }
    }
    console.log(this.finalSplittingResults);
  }

  ngOnInit(): void {
    // get latest data
    this.lists.push(1);
    this.moduleIdentService.requestLouvainCluster();
    this.updateLouvainClusters();
    this.entitySplittingService.requestEntitySplittingStrategyResults();
    this.updateEntitySplittingResult();
    this.funcSplittingService.requestFunctionalitySplittingStrategyResults();
    this.updateFunctionalitySplittingResult();
    this.moduleIdentService.getAllFinaleModules();
    this.updateFinalModules();
    this.globalAnalysisService.requestCurrentGlobalKnowledge();
    this.updateNodeKnowledgeData();

  }

  updateFinalModules(){
    // fill up with latest data
    this.splittingResultSubscribed = this.moduleIdentService.getSplittingResultUpdateListener()
      .subscribe(subject => {
        // clear
        this.finalSplittingResults = [];
        for(let i in subject.splittingResult){
          let splittingResult : SplittingResult = {
            base: "", moduleCluster: [], splittingStrategy: ""
          }
          splittingResult.base = subject.splittingResult[i].base;
          splittingResult.splittingStrategy = subject.splittingResult[i].splittingStrategy;
          splittingResult.moduleCluster = subject.splittingResult[i].moduleCluster;
          splittingResult.usedModules = subject.splittingResult[i].usedModules;
          splittingResult.usage = subject.splittingResult[i].usage;
          this.finalSplittingResults.push(splittingResult);
        }
      });
  }

  updateLouvainClusters(){
    this.louvainClusterSubscribed = this.moduleIdentService.getLouvainClusterUpdateListener()
      .subscribe(subject => {
        // clear
        this.louvainCluster = [];
        for(let i in subject.splittingResult){
          let splittingResult : SplittingResult = {
            base: "", moduleCluster: [], splittingStrategy: ""
          }
          splittingResult.base = subject.splittingResult[i].base;
          splittingResult.splittingStrategy = subject.splittingResult[i].splittingStrategy;
          splittingResult.moduleCluster = subject.splittingResult[i].moduleCluster;
          splittingResult.usedModules = subject.splittingResult[i].usedModules;
          splittingResult.usage = subject.splittingResult[i].usage;
          this.louvainCluster.push(splittingResult);
        }
      });
  }

  updateFunctionalitySplittingResult(){
    // fill up with latest data
    this.splittingResultSubscribed = this.funcSplittingService.getSplittingResultUpdateListener()
      .subscribe(subject => {
        // clear
        this.funcSplittingResults = [];
        for(let i in subject.splittingResult){
          let splittingResult : SplittingResult = {
            base: "", moduleCluster: [], splittingStrategy: ""
          }
          splittingResult.base = subject.splittingResult[i].base;
          splittingResult.splittingStrategy = subject.splittingResult[i].splittingStrategy;
          splittingResult.moduleCluster = subject.splittingResult[i].moduleCluster;
          this.funcSplittingResults.push(splittingResult);
        }
      });
  }

  updateEntitySplittingResult(){
    // fill up with latest data
    this.splittingResultSubscribed = this.entitySplittingService.getSplittingResultUpdateListener()
      .subscribe(subject => {
        // clear
        this.entitySplittingResults = [];
        for(let i in subject.splittingResult){
          let splittingResult : SplittingResult = {
            base: "", moduleCluster: [], splittingStrategy: ""
          }
          splittingResult.base = subject.splittingResult[i].base;
          splittingResult.splittingStrategy = subject.splittingResult[i].splittingStrategy;
          splittingResult.moduleCluster = subject.splittingResult[i].moduleCluster;
          this.entitySplittingResults.push(splittingResult);
        }
      });
  }

  update(){
    // fill up with latest data
    this.semanticKnowledgeSubscribed = this.localAnalysisService.getSemanticKnowledgeUpdateListener()
      .subscribe(subject => {
        // clear
        this.semanticKnowledge = [];
        for(let i in subject.semanticKnowledge){
          let semanticKnowledgeInstance : SemanticKnowledge = {name:"", keywords:[]};
          semanticKnowledgeInstance.name = subject.semanticKnowledge[i].name;
          semanticKnowledgeInstance.keywords = subject.semanticKnowledge[i].keywords;
          this.semanticKnowledge.push(semanticKnowledgeInstance);
        }
      });
  }

  ngOnDestroy(): void {
  }

  onDeleteComponentInModule(base, word){
    this.entitySplittingService.requestDeleteComponentInModule(base, word);
  }

  onSave(){

  }

  onDeclareAsFinalModule(module){
    let finalSplittingResult : SplittingResult = {base: module.base, splittingStrategy: "Manual Assignment", moduleCluster: module.moduleCluster};
    this.finalSplittingResults.push(finalSplittingResult);

  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(

        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      // all the data i need for real change
      //this.moveKeyword(event.container.data[event.currentIndex], event.previousContainer.id, event.container.id);
    }
  }

  moveKeyword(keyword, oldLayer, newLayer){
    this.localAnalysisService.requestMoveKeyword(keyword, oldLayer, newLayer);
  }

  updateNodeKnowledgeData(){
    // fill up with latest data
    this.nodeKnowledgeSubscribed = this.globalAnalysisService.getNodeKnowledgeUpdateListener()
      .subscribe(subject => {
        // clear
        this.nodeKnowledge = [];
        for(let i in subject.nodeKnowledge){
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
          nodeKnowledgeInstance.name = subject.nodeKnowledge[i].name;
          nodeKnowledgeInstance.label = subject.nodeKnowledge[i].label;
          nodeKnowledgeInstance.triangleScore = this.precisionRound(subject.nodeKnowledge[i].triangleScore, 2);
          nodeKnowledgeInstance.triangleCoefficientScore =  this.precisionRound(subject.nodeKnowledge[i].triangleCoefficientScore, 2);
          nodeKnowledgeInstance.betweennessCentralityScore =  this.precisionRound(subject.nodeKnowledge[i].betweennessCentralityScore, 2);
          nodeKnowledgeInstance.pageRankScore = this.precisionRound(subject.nodeKnowledge[i].pageRankScore, 2);
          nodeKnowledgeInstance.closenessCentralityScore = this.precisionRound(subject.nodeKnowledge[i].closenessCentralityScore, 2);
          nodeKnowledgeInstance.classIsEntity = subject.nodeKnowledge[i].classIsEntity;
          nodeKnowledgeInstance.representedEntity = subject.nodeKnowledge[i].representedEntity;
          nodeKnowledgeInstance.keywords = subject.nodeKnowledge[i].keywords;
          nodeKnowledgeInstance.associatedLayers = subject.nodeKnowledge[i].associatedLayers;
          nodeKnowledgeInstance.calculatedInterpretation = subject.nodeKnowledge[i].calculatedInterpretation;
          nodeKnowledgeInstance.reviewNecessary = subject.nodeKnowledge[i].reviewNecessary;
          nodeKnowledgeInstance.review = subject.nodeKnowledge[i].review;
          nodeKnowledgeInstance.representedMeanModuleType = subject.nodeKnowledge[i].representedMeanModuleType;
          nodeKnowledgeInstance.associatedMeanModuleType = subject.nodeKnowledge[i].associatedMeanModuleType;

          this.nodeKnowledge.push(nodeKnowledgeInstance);


        }
        let classesUsed = [];
        for(let i in this.finalSplittingResults){
          for(let j in this.finalSplittingResults[i].moduleCluster){
            classesUsed.push(this.finalSplittingResults[i].moduleCluster[j]);
          }
        }
        this.setUpNodeKnowledge(classesUsed);

      });
  }

  onDuplicateNodeKnowledge(name){
    for(let i in this.nodeKnowledge){
      if(name==this.nodeKnowledge[i].name){
        this.nodeKnowledge.push(this.nodeKnowledge[i]);
      }
    }
  }

  // method by: https://expertcodeblog.wordpress.com/2018/02/12/typescript-javascript-round-number-by-decimal-pecision/
  public precisionRound(number: number, precision: number)
  {
    if (precision < 0)
    {
      let factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    }
    else
      return +(Math.round(Number(number + "e+" + precision)) +
        "e-" + precision);
  }
}
