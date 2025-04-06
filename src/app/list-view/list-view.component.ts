import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../data.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-list-view',
  imports: [ RouterLink, NgFor ],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.css'
})
export class ListViewComponent implements OnInit, OnDestroy {
  missing_persons: any[] = [];

  constructor(private dataService: DataService) { }

  onClick() {
    this.dataService.getData().subscribe(
      data => this.missing_persons = data,
      error => console.error('Error fetching data:', error)
    );
  }

  ngOnInit() {
    var json = localStorage.getItem('missing_persons');
    if (json != null) {
      this.missing_persons = JSON.parse(json);
    }
  }

  ngOnDestroy() {
    localStorage.setItem('missing_persons', JSON.stringify(this.missing_persons));
  }
}
