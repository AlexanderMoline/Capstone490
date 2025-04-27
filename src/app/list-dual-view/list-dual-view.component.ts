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

  constructor(private backend: BackendService) {}

  ngOnInit(): void {
    // Fire the combined search
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
