import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {SplittingResult} from "../entity-splitting.model";
import {Subscription} from "rxjs";
import {EntitySplittingService} from "../entity-splitting.service";


/**
 * @title Chips with input
 */
@Component({
  selector: 'entity-splitting',
  templateUrl: 'entity-splitting.component.html',
  styleUrls: ['entity-splitting.component.css'],
})
export class EntitySplittingComponent implements OnInit, OnDestroy{
  // chips
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  entitySplittingService : EntitySplittingService;

  // model
  splittingResults : SplittingResult[] = [];
  private splittingResultSubscribed : Subscription;

  constructor(entitySplittingService : EntitySplittingService) {
    this.entitySplittingService = entitySplittingService;
  }

  ngOnInit(): void {
    this.entitySplittingService.requestEntitySplittingStrategyResults();
    this.updateEntitySplittingResult();
  }

  updateEntitySplittingResult(){
    // fill up with latest data
    this.splittingResultSubscribed = this.entitySplittingService.getSplittingResultUpdateListener()
      .subscribe(subject => {
        // clear
        this.splittingResults = [];
        for(let i in subject.splittingResult){
          let splittingResult : SplittingResult = {
            base: "", moduleCluster: [], splittingStrategy: ""
          }
          splittingResult.base = subject.splittingResult[i].base;
          splittingResult.splittingStrategy = subject.splittingResult[i].splittingStrategy;
          splittingResult.moduleCluster = subject.splittingResult[i].moduleCluster;
          this.splittingResults.push(splittingResult);
        }
        console.log(this.splittingResults);
      });
  }

  remove(result, component) {
    this.entitySplittingService.requestDeleteComponentInModule(result.base, component);
    this.updateEntitySplittingResult();
  }

  ngOnDestroy(): void {
  }


}
