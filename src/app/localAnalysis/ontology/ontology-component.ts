import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {LocalAnalysisService} from "../local-analysis.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {SelectionModel} from "@angular/cdk/collections";
import {SemanticKnowledge} from "../local-analysis.model";;

export interface User {
  name: string;
}

export interface Keyword {
  name: string;
}

const ONTOLOGY_DATA : OntologyKnowledge[] = [
  {layer: 'Persistence Layer', description: 'test', javaEEComponent: 'serviceImpl', associatedKeyword: '' }
];

export interface OntologyKnowledge{
  layer: string,
  description: string,
  javaEEComponent: string,
  associatedKeyword : string
}

@Component({
  selector: 'ontology-component',
  templateUrl: 'ontology.component.html',
  styleUrls: ['ontology.component.css'],
})
export class OntologyComponent implements AfterViewInit, OnInit {
  localAnalysisService : LocalAnalysisService;

  // table operations
  selection;
  clickedRows = new Set<OntologyKnowledge>();
  private semanticKnowledge : SemanticKnowledge[];
  private semanticKnowledgeSubscribed : Subscription;

  @Input()
  ontologyKnowledge : OntologyKnowledge[] = [];
  private ontologyKnowledgeSubscribed : Subscription;

  // table
  dataSource = new MatTableDataSource<OntologyKnowledge>()
  displayedColumns: string[] = ['javaEEComponent', 'description', 'associatedKeyword', 'editKeyword', 'save', 'layer'];
  @ViewChild(MatSort) sort: MatSort;
  keywords : Keyword[] = [];
  myControl = new FormControl();
  options: Keyword[] = []
  filteredOptions: Observable<Keyword[]>;

  selectedOptions : [{"index" : number, "option" : string}] = [{"index" : -1, "option" : ""}] ;

  constructor(private _liveAnnouncer: LiveAnnouncer, localAnalysisService : LocalAnalysisService) {
    this.localAnalysisService = localAnalysisService;
  }

  onSelectOption(index, selectedOption){
    this.selectedOptions.push({"index" : index, "option" : selectedOption});
  }

  onSaveKeywordForJavaEEComponent(element, index){
    for(let i in this.selectedOptions){
      if(index==this.selectedOptions[i].index){
        this.localAnalysisService.requestAssociateKeyword(element.javaEEComponent, this.selectedOptions[i].option)
      }
    }
  }

  ngOnInit() {

      this.localAnalysisService.requestCurrentOntologyKnowledge();
      this.localAnalysisService.requestCurrentSemanticKnowledge();
      this.updateOntologyKnowledge();
      this.updateSemanticKnowledge();
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
        this.setUpOnUpdate();
      });
  }

  updateSemanticKnowledge(){
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
        this.setUpSemanticKnowledgeOnUpdate();
      });
  }

  requestDefaultAnalysis(){
    this.localAnalysisService.requestSemanticAnalysisResults();
  }

  setUpOnUpdate(){
    this.dataSource = new MatTableDataSource(this.ontologyKnowledge);
  }

  setUpSemanticKnowledgeOnUpdate(){
    for(let i in this.semanticKnowledge){
      for(let j in this.semanticKnowledge[i].keywords){
        this.keywords.push({name: this.semanticKnowledge[i].keywords[j]})
      }
    }
    this.options = this.keywords;

  }

  // set up table
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<OntologyKnowledge>(allowMultiSelect, initialSelection);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.options.slice())),
    );
  }













  // table functions

  displayFn(keyword: Keyword): string {
    return keyword && keyword.name ? keyword.name : '';
  }

  private _filter(name: string): Keyword[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
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
