import {Component, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Subscription} from "rxjs";
import {OntologyKnowledge} from "../../ontology/ontology-component";
import {LocalAnalysisService} from "../../local-analysis.service";
import {EntitySplittingProfileModel} from "../entity-splitting-profile.model";
import {SemanticKnowledge} from "../../local-analysis.model";
import {EntitySplittingService} from "../entity-splitting.service";

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'entitySplittingProfilingComponent',
  templateUrl: 'entity-splitting-profiling.component.html',
  styleUrls: ['entity-splitting-profiling.component.css'],
})
export class EntitySplittingProfilingComponent implements OnInit, OnDestroy {
  localAnalysisService : LocalAnalysisService;
  entitySplittingService : EntitySplittingService;
  private entitySplittingProfileSubscribed : Subscription;

  javaEEComponents = [];
  allowedJavaEEComponents = [];
  filteredJavaEEComponents = [];
  centralJavaEEComponent = [];
  substitutionalJavaEEComponent = [];
  searchExtent = 0;

  searchExtents : number[] = [1,2,3,4];

  entitySplittingProfile : EntitySplittingProfileModel[] = [];



  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  ontologyKnowledge : OntologyKnowledge[] = [];
  private ontologyKnowledgeSubscribed : Subscription;

  constructor(localAnalysisService : LocalAnalysisService, entitySplittingService : EntitySplittingService) {
    this.localAnalysisService = localAnalysisService;
    this.entitySplittingService = entitySplittingService;
  }

  save(){
    let entitySplittingProfileInstance : EntitySplittingProfileModel = {
      allowedJavaEEComponents: this.allowedJavaEEComponents,
      centralJavaEEComponent: this.centralJavaEEComponent[0],
      filteredJavaEEComponents: this.filteredJavaEEComponents,
      searchDepth: this.searchExtent,
      substitutionalCentralJavaEEComponent: this.substitutionalJavaEEComponent[0]
    };
    this.entitySplittingProfile.push(entitySplittingProfileInstance);
    this.entitySplittingService.requestUpdateSplittingStrategy(this.entitySplittingProfile);
    this.updateEntitySplittingProfile();
  }

  setSearchExtent(searchExtent){
    this.searchExtent = searchExtent;
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
      this.moveKeyword(event.container.data[event.currentIndex], event.container.id);
    }
  }

  moveKeyword(javaEEComponent, newList){
    console.log(javaEEComponent); console.log(newList);
  }

  setUpOnOntologyUpdate(){
    for(let i in this.ontologyKnowledge){
      this.javaEEComponents.push(this.ontologyKnowledge[i].javaEEComponent);
    }
  }

  setUpOnEntitySplittingProfileUpdate(){
    for(let i in this.entitySplittingProfile){
      for(let j in this.entitySplittingProfile[i].allowedJavaEEComponents){
        this.allowedJavaEEComponents.push(this.entitySplittingProfile[i].allowedJavaEEComponents[j]);
      }
    }
    for(let i in this.entitySplittingProfile){
      for(let j in this.entitySplittingProfile[i].filteredJavaEEComponents){
        this.filteredJavaEEComponents.push(this.entitySplittingProfile[i].filteredJavaEEComponents[j]);
      }
    }
    for(let i in this.entitySplittingProfile){
        this.centralJavaEEComponent.push(this.entitySplittingProfile[i].centralJavaEEComponent);
    }
    for(let i in this.entitySplittingProfile){
        this.substitutionalJavaEEComponent.push(this.entitySplittingProfile[i].substitutionalCentralJavaEEComponent);
    }
  }

  updateOntologyKnowledge(){
    // fill up with latest data
    this.ontologyKnowledgeSubscribed = this.localAnalysisService.getOntologyKnowledgeUpdateListener()
      .subscribe(subject => {
        // clear
        this.ontologyKnowledge = [];
        for(let i in subject.ontologyKnowledge){
          let ontologyKnowledgeInstance : OntologyKnowledge = {
            layer:"",
            description: "",
            javaEEComponent: "",
            associatedKeyword: "",
          };
          ontologyKnowledgeInstance.layer = subject.ontologyKnowledge[i].layer;
          ontologyKnowledgeInstance.description = subject.ontologyKnowledge[i].description;
          ontologyKnowledgeInstance.javaEEComponent = subject.ontologyKnowledge[i].javaEEComponent;
          ontologyKnowledgeInstance.associatedKeyword = subject.ontologyKnowledge[i].associatedKeyword;
          this.ontologyKnowledge.push(ontologyKnowledgeInstance);
        }
        this.setUpOnOntologyUpdate();
      });
  }

  updateEntitySplittingProfile(){
    // fill up with latest data
    this.entitySplittingProfileSubscribed = this.entitySplittingService.getEntitySplittingProfileUpdateListener()
      .subscribe(subject => {
        // clear
        this.entitySplittingProfile = [];
        for(let i in subject.entitySplittingProfile){
          let entitySplittingProfileInstance : EntitySplittingProfileModel = {
            allowedJavaEEComponents: [],
            centralJavaEEComponent: "",
            filteredJavaEEComponents: [],
            searchDepth: 0,
            substitutionalCentralJavaEEComponent: ""
          };
          entitySplittingProfileInstance.searchDepth = subject.entitySplittingProfile[i].searchDepth;
          entitySplittingProfileInstance.allowedJavaEEComponents = subject.entitySplittingProfile[i].allowedJavaEEComponents;
          entitySplittingProfileInstance.filteredJavaEEComponents = subject.entitySplittingProfile[i].filteredJavaEEComponents;
          entitySplittingProfileInstance.centralJavaEEComponent = subject.entitySplittingProfile[i].centralJavaEEComponent;
          entitySplittingProfileInstance.substitutionalCentralJavaEEComponent = subject.entitySplittingProfile[i].substitutionalCentralJavaEEComponent;
          this.entitySplittingProfile.push(entitySplittingProfileInstance);
        }
        this.setUpOnEntitySplittingProfileUpdate();
      });
  }

  ngOnInit(): void {
    this.entitySplittingService.requestCurrentEntitySplittingProfile();
    this.updateEntitySplittingProfile();
    this.localAnalysisService.requestCurrentOntologyKnowledge();
    this.updateOntologyKnowledge();
  }

  ngOnDestroy(): void {

  }


}
