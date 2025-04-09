import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BackendService } from '../backend.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-list-view',
  imports: [ RouterLink, NgFor ],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.css'
})
export class ListViewComponent implements OnInit, OnDestroy {
  missing_persons: any[] = [];

  constructor(private backendService: BackendService) { }

  onClick() {
    if (this.backendService.searchMissingResult != null) {
      this.backendService.searchMissingResult.subscribe(
        data => this.missing_persons = data,
        error => console.error('Error fetching data:', error)
      );
    }
  }

  ngOnInit() {
    if (this.backendService.searchMissingResult != null) {
      // Retrieve results of search from backend service
      this.backendService.searchMissingResult.subscribe(
        data => this.missing_persons = data,
        error => console.error('Error fetching data:', error)
      );
    } else {
      // Restore previous table data from browser cache
      var json = localStorage.getItem('missing_persons');
      if (json != null) {
        this.missing_persons = JSON.parse(json);
      }
    }
  }

  ngOnDestroy() {
    // Store table data in browser cache
    localStorage.setItem('missing_persons', JSON.stringify(this.missing_persons));
  }
}
