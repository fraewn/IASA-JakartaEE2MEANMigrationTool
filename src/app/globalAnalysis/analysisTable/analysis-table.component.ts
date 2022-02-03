import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatSortable, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from "@angular/cdk/collections";
import {GlobalAnalysisService} from "../global-analysis.service";
import {Subscription} from "rxjs";
import {NodeKnowledge} from "../global-analysis.model";

export interface JavaEEComponents{
  name: string
}

@Component({
  selector: 'analysis-table',
  templateUrl: 'analysis-table.component.html',
  styleUrls: ['analysis-table.component.css']
})
export class AnalysisTableComponent implements AfterViewInit, OnInit, OnDestroy {
  globalAnalysisService : GlobalAnalysisService;
  meanModuleTypeOptions : string[];
  javaEEComponentOptions : string[] = [];
  selectedItems = [];

  @Input()
  nodeKnowledge : NodeKnowledge[] = [];
  javaEEComponents : JavaEEComponents[] = [];
  private nodeKnowledgeSubscribed : Subscription;
  private javaEEComponentsSubscribed : Subscription;

  displayedColumns: string[] = ['name', 'label', 'triangleScore', 'triangleCoefficientScore', 'betweennessCentralityScore',
    'closenessCentralityScore', 'pageRankScore', 'calculatedInterpretation', 'javaEEComponentOptions'];
  dataSource = new MatTableDataSource<NodeKnowledge>()
  selection;
  clickedRows = new Set<NodeKnowledge>();
  public myReviews : any = {};

  constructor(private _liveAnnouncer: LiveAnnouncer, globalAnalysisService : GlobalAnalysisService) {
      this.globalAnalysisService = globalAnalysisService;
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {

  }

  remove(interpretation){
    console.log(interpretation);
  }

  printItem(name, option){
    this.globalAnalysisService.requestUpdateJavaEEComponent(name, option);
    this.updateNodeKnowledgeData();
  }

  setUpOnUpdate(){
    this.dataSource = new MatTableDataSource(this.nodeKnowledge);
    this.sort.sort(({ id: 'name', start: 'asc'}) as MatSortable);
    this.dataSource.sort = this.sort;
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<NodeKnowledge>(allowMultiSelect, initialSelection);
    this.meanModuleTypeOptions = ["cross section", "functional", "wrapper"];
    this.globalAnalysisService.getAllJavaEEComponents();

  }

  updateJavaEEComponents(){
    this.javaEEComponentsSubscribed = this.globalAnalysisService.getJavaEEComponentsUpdateListener().subscribe(subject =>{
      this.javaEEComponents = [];
      for(let i in subject.javaEEComponents){
        let javaEEComponent : JavaEEComponents = {name:""};
        javaEEComponent.name = subject.javaEEComponents[i].name;
        this.javaEEComponents.push(javaEEComponent);
      }
      for(let i in this.javaEEComponents){
        this.javaEEComponentOptions.push(this.javaEEComponents[i].name);
      }
    });
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
        // no semantic analysis was ever executed before, so there was not data received from backend
        if(this.nodeKnowledge.length==0){
          this.requestDefaultAnalysis();
          console.log("Default analysis is executed, since no data was there yet")
        }
        this.setUpOnUpdate();
      });
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

  requestDefaultAnalysis(){

  }



  ngAfterViewInit() {
    this.globalAnalysisService.requestCurrentGlobalKnowledge();
    this.updateNodeKnowledgeData();
    this.updateJavaEEComponents();

  }

  onSaveAssignment(element, myReview){
    console.log(myReview);
    // save review in database
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  ngOnDestroy(): void {
  }


}


