import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {AnalysisService} from "../analysis.service";
import {Analysis} from "../analysis.model";

@Component({
  selector: 'app-analysis-list',
  templateUrl: 'analysis-list.component.html',
  styleUrls: ['analysis-list.component.css']
})
export class AnalysisListComponent implements OnInit, OnDestroy{
  userId: string;
  analysisService;

  constructor(analysisService : AnalysisService) {
    this.analysisService = analysisService;
  }

  // ALTERNATIVE CODE
  // with public keyword, a class variable reportService is created automatically
  //constructor(public reportService: ReportService) {
  //}

  @Input()
  analyses : Analysis[] = [];
  isLoading = false;
  totalAnalyses = 0;
  analysesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  private analysesSubscribed : Subscription;
  // a function that angular executes as initation every time the Component is created
  ngOnInit() {
    // init tasks
    // fetch all reports
    this.isLoading = true;
    // since this is the init method, we start on page 1 as currentPage
    this.analysisService.getAnalyses(this.analysesPerPage, this.currentPage);

    // we receive the reportsUpdated array basically (i think this class is the observer)
    // first arg: function that is executed when something changed/ new data is emitted
    // second arg: function whenever an error occurs
    // third arg: function whenever observable is ended
    // we get the observable from this.reportService.getReportUpdateListener() and then we subsribe to it for reports
    // as observer we can use the three functions next(), error() and complete() which we can declare as parameters in the subsribe function
    this.analysesSubscribed = this.analysisService.getReportUpdateListener()
      .subscribe((analysisData : {analyses: Analysis[], analysesCount: number}) => {
        this.isLoading = false;
        // update reports in this class
        this.totalAnalyses = analysisData.analysesCount;
        this.analyses = analysisData.analyses;
    }, (analyses) => {
      console.log("no data could be retrieved from observable");
    });
  }

  ngOnDestroy() {
    // prevent memory leaks by unsubscribing when component is not used in DOM
    this.analysesSubscribed.unsubscribe();
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    // page index starts at 0, but we want to start at 1, therefore + 1
    this.currentPage = pageData.pageIndex + 1;
    // pageSize is an attribute the user can select in the drop down
    this.analysesPerPage = pageData.pageSize;
    this.analysisService.getAnalyses(this.analysesPerPage, this.currentPage);
  }
}
