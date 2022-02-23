import {Component, OnInit} from '@angular/core';

// a page is composed of components in angular
// this way you have small, easily to maintain and reusable building blocks in the app
// each component is typically made up of more than one file (css, ts...)
@Component({
  // the AppComponent defined in this file is identified by its selector:
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'JavaEE2MEAN Migration';

  constructor() {
  }

  ngOnInit(): void {
  }
}
