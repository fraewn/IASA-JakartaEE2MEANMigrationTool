import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {SplittingResult} from "../../entity-splitting/entity-splitting.model";
import {FuncSplittingService} from "../func-splitting.service";

/**
 * @title Chips with input
 */
@Component({
  selector: 'func-splitting',
  templateUrl: 'func-splitting.component.html',
  styleUrls: ['func-splitting.component.css'],
})
export class FuncSplittingComponent implements OnInit, OnDestroy{
  // chips
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  funcSplittingService : FuncSplittingService;

  // model
  splittingResults : SplittingResult[] = [];
  private splittingResultSubscribed : Subscription;

  constructor(funcSplittingService : FuncSplittingService) {
    this.funcSplittingService = funcSplittingService;
  }

  ngOnInit(): void {
    this.funcSplittingService.requestFunctionalitySplittingStrategyResults();
    this.updateFunctionalitySplittingResult();

  }

  updateFunctionalitySplittingResult(){
    // fill up with latest data
    this.splittingResultSubscribed = this.funcSplittingService.getSplittingResultUpdateListener()
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
        if(this.splittingResults.length==0){
          this.funcSplittingService.requestExecuteFunctionalitySplittingStrategy();
          this.updateFunctionalitySplittingResult();
        }
      });
  }

  remove(result, component) {
    this.funcSplittingService.requestDeleteComponentInModule(result.base, component);
    this.updateFunctionalitySplittingResult();
  }

  ngOnDestroy(): void {
  }


}
