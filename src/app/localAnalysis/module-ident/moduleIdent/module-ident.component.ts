import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {SemanticKnowledge} from "../../local-analysis.model";
import {fromEvent, Observable, Subscription} from "rxjs";
import {LocalAnalysisService} from "../../local-analysis.service";
import {EntitySplittingService} from "../../entity-splitting/entity-splitting.service";
import {FuncSplittingService} from "../../func-splitting/func-splitting.service";
import {SplittingResult} from "../../entity-splitting/entity-splitting.model";
import {ModuleIdentService} from "../module-ident.service";

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'module-ident-drag-and-drop',
  templateUrl: 'module-ident.component.html',
  styleUrls: ['module-ident.component.css'],
})
export class ModuleIdentComponent implements OnInit, OnDestroy{
  localAnalysisService : LocalAnalysisService;
  entitySplittingService : EntitySplittingService;
  funcSplittingService : FuncSplittingService;
  moduleIdentService : ModuleIdentService;
  // model
  entitySplittingResults : SplittingResult[] = [];
  funcSplittingResults : SplittingResult[] = [];
  finalSplittingResults : SplittingResult[] = [];
  private splittingResultSubscribed : Subscription;
  componentName = "";
  lists = [];

  semanticKnowledge : SemanticKnowledge[] = [];
  private semanticKnowledgeSubscribed : Subscription;

  name="TestTEst";

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  doner = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  constructor(localAnalysisService : LocalAnalysisService, funcSplittingService : FuncSplittingService, entitySplittingService : EntitySplittingService,
              moduleIdentService : ModuleIdentService) {
    this.localAnalysisService = localAnalysisService;
    this.funcSplittingService = funcSplittingService;
    this.entitySplittingService = entitySplittingService;
    this.moduleIdentService = moduleIdentService;
  }

  onDeleteComponent(component){
    console.log(component);
    this.moduleIdentService.deleteModule(component);
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

  saveFinalModuleComponent(cluster){
    console.log(cluster);
    this.moduleIdentService.addFinaleModule(cluster);
  }
  updateModuleComponent(component) {

  }

  onDuplicateElement(base, element){
    for(let i in this.finalSplittingResults){
      if(base==this.finalSplittingResults[i].base){
        this.finalSplittingResults[i].moduleCluster.push(element);
      }
    }
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
    this.entitySplittingService.requestEntitySplittingStrategyResults();
    this.updateEntitySplittingResult();
    this.funcSplittingService.requestFunctionalitySplittingStrategyResults();
    this.updateFunctionalitySplittingResult();
    this.moduleIdentService.getAllFinaleModules();
    this.updateFinalModules();
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
          this.finalSplittingResults.push(splittingResult);
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

  drop(event: CdkDragDrop<string[]>, layer) {
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
}
