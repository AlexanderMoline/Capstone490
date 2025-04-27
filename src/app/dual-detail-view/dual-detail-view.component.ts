import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackendService } from '../backend.service';

@Component({
  standalone: true,
  selector: 'app-dual-detail-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './dual-detail-view.component.html',
  styleUrls: ['./dual-detail-view.component.css'],
})
export class DualDetailViewComponent implements OnInit {
  missing: any;
  unidentified: any;

  mpCase: string | null = null;
  upNamus: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
  ) {}

  ngOnInit(): void {
    this.mpCase = this.route.snapshot.paramMap.get('mp_case_number');
    this.upNamus = this.route.snapshot.paramMap.get('up_namus_number');

    if (this.mpCase && this.upNamus) {
      this.backend.getPairDetails(this.mpCase, this.upNamus).subscribe(
        ({ missing_person, unidentified_person }) => {
          this.missing = missing_person;
          this.unidentified = unidentified_person;
        },
        (err) => console.error('Error loading details', err),
      );
    }
  }
}
