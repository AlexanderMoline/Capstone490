import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../data.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-list-view',
  imports: [ RouterLink, NgFor ],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.css'
})
export class ListViewComponent {
  missing_persons: any[] = [];

  constructor(private dataService: DataService) { }

  onClick() {
    this.dataService.getData().subscribe(
      data => this.missing_persons = data,
      error => console.error('Error fetching data:', error)
    );
  }
}
