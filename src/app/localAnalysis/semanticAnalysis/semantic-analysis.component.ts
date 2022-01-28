import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from "@angular/cdk/collections";
import {SemanticKnowledge} from "../local-analysis.model";
import {LocalAnalysisService} from "../local-analysis.service";
import {Subscription} from "rxjs";


const SEMANTIC_ANALYSIS_DATA : SemanticKnowledge[] = [
  {name: 'Persistence Layer', keywords: ['DAO', 'Service'] },
  {name: 'Web Layer', keywords: ['REST', 'Service'] }
];

export interface SemanticAnalysisExtension{
  layer: string,
  searchExtent: number,
  additionalKeywords : string[]
}


@Component({
  selector: 'semantic-analysis',
  templateUrl: 'semantic-analysis.component.html',
  styleUrls: ['semantic-analysis.component.css']
})
export class SemanticAnalysisComponent implements AfterViewInit, OnInit, OnDestroy{
  localAnalysisService : LocalAnalysisService;

  @Input()
  semanticKnowledge : SemanticKnowledge[] = [];
  private semanticKnowledgeSubscribed : Subscription;

  // table
  dataSource = new MatTableDataSource<SemanticKnowledge>()
  displayedColumns: string[] = ['name', 'include', 'searchExtent',  'execute', 'keywords', 'review', 'check', 'save'];
  public myReviews : any = {};
  public additionalKeywords: any = {};
  @ViewChild(MatSort) sort: MatSort;

  // table operations
  selection;
  searchExtents : number[] = [1,2,3,4];
  semanticAnalysisExtensions : SemanticAnalysisExtension[] = [];
  extentForAll = 3;
  layers = {};
  clickedRows = new Set<SemanticKnowledge>();

  constructor(private _liveAnnouncer: LiveAnnouncer, localAnalysisService : LocalAnalysisService) {
    this.localAnalysisService = localAnalysisService;
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
        // no semantic analysis was ever executed before, so there was not data received from backend
        if(this.semanticKnowledge.length==0){
          this.requestDefaultAnalysis();
          console.log("Default analysis is executed, since no data was there yet")
        }
        this.setUpOnUpdate();
      });
  }

  setUpOnUpdate(){
    this.dataSource = new MatTableDataSource(this.semanticKnowledge);
    this.setUpSearchExtendsPerLayer();
  }

  ngOnInit(): void {
    this.localAnalysisService.requestCurrentSemanticKnowledge();
    this.update();

  }

  requestDefaultAnalysis(){
    this.localAnalysisService.requestSemanticAnalysisResults();
  }

  // set up table
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<SemanticKnowledge>(allowMultiSelect, initialSelection);
  }

  updateSearchExtendForALayer(searchExtent, element){
    for(let i in this.semanticAnalysisExtensions){
      if(this.semanticAnalysisExtensions[i].layer == element.name){
        this.semanticAnalysisExtensions[i].searchExtent = searchExtent;
      }
    }
  }

  setUpSearchExtendsPerLayer(){
    // clear
    this.semanticAnalysisExtensions = [];
    for(let i in this.semanticKnowledge){
      let searchExtentPerLayer : SemanticAnalysisExtension = {"layer": "", "searchExtent": 0, "additionalKeywords": []};
      searchExtentPerLayer.layer = this.semanticKnowledge[i].name;
      searchExtentPerLayer.searchExtent = 3;
      this.semanticAnalysisExtensions.push(searchExtentPerLayer);
    }
  }

  onSaveAssignment(element, myReview){
    console.log(myReview);
    console.log(element.name);
    // save review in database
  }

  onStartSemanticAnalysisForALayer(element){
    let layer = element.name;
    this.localAnalysisService.requestSemanticAnalysisForALayerResult(layer, this.semanticAnalysisExtensions);
  }

  onStartSemanticAnalysisForAll(){
    console.log("start semantic analysis for all");
  }

  onStartAnalysisWithOwnKeywords(element, text){
    console.log(text);
    let additionalKeywords : string[] = text.split(", ");
    console.log(additionalKeywords);
    console.log(element.name);
  }

  onSetExtentForAll(extentForAll){
    this.extentForAll = extentForAll;
    console.log(this.extentForAll);
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


