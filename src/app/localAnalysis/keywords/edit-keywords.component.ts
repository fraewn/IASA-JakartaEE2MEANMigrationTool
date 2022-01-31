import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {SemanticKnowledge} from "../local-analysis.model";
import {fromEvent, Observable, Subscription} from "rxjs";
import {LocalAnalysisService} from "../local-analysis.service";
import {delay, takeUntil, tap} from "rxjs/operators";

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'cdk-drag-drop-connected-sorting-example',
  templateUrl: 'edit-keywords.component.html',
  styleUrls: ['edit-keywords.component.css'],
})
export class EditKeywordsComponent implements OnInit, OnDestroy{
  localAnalysisService : LocalAnalysisService;
  lists = [];

  semanticKnowledge : SemanticKnowledge[] = [];
  private semanticKnowledgeSubscribed : Subscription;

  name="TestTEst";

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  doner = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  constructor(localAnalysisService : LocalAnalysisService) {
    this.localAnalysisService = localAnalysisService;
  }

  ngOnInit(): void {
    // get latest data
    this.localAnalysisService.requestCurrentSemanticKnowledge();
    this.update();
    this.lists.push(1);
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

  onDeleteKeyword(layer, keyword){
    this.localAnalysisService.requestDeleteKeywordFromLayer(layer, keyword);
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
      this.moveKeyword(event.container.data[event.currentIndex], event.previousContainer.id, event.container.id);
    }
  }

  moveKeyword(keyword, oldLayer, newLayer){
    this.localAnalysisService.requestMoveKeyword(keyword, oldLayer, newLayer);
  }
}
