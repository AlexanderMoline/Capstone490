import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-detail-view',
  imports: [RouterLink],
  templateUrl: './detail-view.component.html',
  styleUrl: './detail-view.component.css'
})
export class DetailViewComponent implements OnInit {
  caseDetails: any;  // Will store data from the API
  table: string | null = null;

  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const caseNumber = this.route.snapshot.paramMap.get('case_number');
    this.table = this.route.snapshot.paramMap.get('table');

    if (caseNumber) {
      this.backendService.getCaseDetails(caseNumber).subscribe(
        data => this.caseDetails = data,
        error => console.error('Error fetching case details', error)
      );
    }
  }
}
