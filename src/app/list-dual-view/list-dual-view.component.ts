import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BackendService } from '../backend.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-list-dual-view',
  templateUrl: './list-dual-view.component.html',
  styleUrls: ['./list-dual-view.component.css'],
  imports: [RouterLink, CommonModule],
})
export class ListDualViewComponent implements OnInit, OnDestroy {
  missingPersons: any[] = [];
  unidentifiedPersons: any[] = [];
  selectedMissing: string | null = null;
  selectedUnidentified: string | null = null;
  private subs = new Subscription();

  // pagination state
  pageSize = 25;
  missingPage = 1;
  unidentifiedPage = 1;

  constructor(private backend: BackendService) {}

  ngOnInit(): void {
    this.subs.add(
      this.backend.getComparisonResults().subscribe(
        (data) => {
          this.missingPersons = data.missing_persons;
          this.unidentifiedPersons = data.unidentified_persons;
        },
        (err) => console.error(err),
      ),
    );
  }

  // computed getters for slices
  get pagedMissing() {
    const start = (this.missingPage - 1) * this.pageSize;
    return this.missingPersons.slice(start, start + this.pageSize);
  }
  get pagedUnidentified() {
    const start = (this.unidentifiedPage - 1) * this.pageSize;
    return this.unidentifiedPersons.slice(start, start + this.pageSize);
  }

  // total page counts
  get missingTotalPages() {
    return Math.ceil(this.missingPersons.length / this.pageSize) || 1;
  }
  get unidentifiedTotalPages() {
    return Math.ceil(this.unidentifiedPersons.length / this.pageSize) || 1;
  }

  // page navigation
  prevMissing() {
    if (this.missingPage > 1) this.missingPage--;
  }
  nextMissing() {
    if (this.missingPage < this.missingTotalPages) this.missingPage++;
  }

  prevUnidentified() {
    if (this.unidentifiedPage > 1) this.unidentifiedPage--;
  }
  nextUnidentified() {
    if (this.unidentifiedPage < this.unidentifiedTotalPages)
      this.unidentifiedPage++;
  }

  selectMissing(id: string) {
    this.selectedMissing = id;
  }
  deselectMissing() {
    this.selectedMissing = null;
  }
  selectUnidentified(id: string) {
    this.selectedUnidentified = id;
  }
  deselectUnidentified() {
    this.selectedUnidentified = null;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
