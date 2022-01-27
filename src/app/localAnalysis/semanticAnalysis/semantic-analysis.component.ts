import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from "@angular/cdk/collections";
import {SemanticKnowledge} from "../local-analysis.model";


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  review: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', review: ''},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', review: ''},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', review: 'test2'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', review: ''},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', review: 'test'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', review: ''},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', review: ''},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', review: ''},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', review: ''},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', review: ''},
];

const SEMANTIC_ANALYSIS_DATA : SemanticKnowledge[] = [
  {id: 'l1', name: 'Persistence Layer', keywords: ['DAO', 'Service'] },
  {id: 'l2', name: 'Web Layer', keywords: ['REST', 'Service'] }
];


@Component({
  selector: 'semantic-analysis',
  templateUrl: 'semantic-analysis.component.html',
  styleUrls: ['semantic-analysis.component.css']
})
export class SemanticAnalysisComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'include', 'searchExtent',  'execute', 'keywords', 'review', 'check', 'save'];
  dataSource = new MatTableDataSource(SEMANTIC_ANALYSIS_DATA);
  selection;
  clickedRows = new Set<SemanticKnowledge>();
  public myReviews : any = {};

  constructor(private _liveAnnouncer: LiveAnnouncer) {

  }

  @ViewChild(MatSort) sort: MatSort;


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<SemanticKnowledge>(allowMultiSelect, initialSelection);

  }

  onSaveAssignment(element, myReview){
    console.log(myReview);
    // save review in database
  }

  onEnterKeyword(element, text){
    console.log(text);
    let additionalKeywords : string[] = text.split(", ");
    console.log(additionalKeywords);
  }

  splitByCommata(text){

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
}


