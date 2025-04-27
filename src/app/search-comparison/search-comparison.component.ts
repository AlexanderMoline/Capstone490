// src/app/search-comparison/search-comparison.component.ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-search-comparison',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './search-comparison.component.html',
})
export class SearchComparisonComponent {
  private searchParams = new Map<string, string>();

  search = new FormGroup({
    state: new FormControl(''),
    county: new FormControl(''),
    city: new FormControl(''),
    sex: new FormControl(''),
    race: new FormControl(''),
    hairColor: new FormControl(''), // added
    eyeColor: new FormControl(''), // added
    missingFrom: new FormControl(''),
    missingTo: new FormControl(''),
    bodyFoundFrom: new FormControl(''),
    bodyFoundTo: new FormControl(''),
  });

  constructor(private backendService: BackendService) {}

  onSubmit() {
    this.searchParams.clear();

    this.addControlToSearch('state', 'state');
    this.addControlToSearch('county', 'county');
    this.addControlToSearch('city', 'city');
    this.addControlToSearch('sex', 'biological_sex');
    this.addControlToSearch('race', 'race_ethnicity');
    this.addControlToSearch('hairColor', 'hair_color');
    this.addControlToSearch('eyeColor', 'eye_color');

    // missing-age range
    this.addControlToSearch('missingFrom', 'age_from');
    this.addControlToSearch('missingTo', 'age_to');

    // optional body-found-year mapping
    // this.addControlToSearch('bodyFoundFrom','missing_age');
    // this.addControlToSearch('bodyFoundTo',  'missing_age');

    // save for the dual-list component
    this.backendService.saveComparisonParams(this.searchParams);

    // for debugging
    console.log(
      '🔍 comparison URL =',
      this.backendService.constructSearchUrl(this.searchParams, 'persons'),
    );
  }

  private addControlToSearch(controlName: string, paramName: string) {
    const val = this.search.get(controlName)?.value;
    if (val !== null && val !== '') {
      this.searchParams.set(paramName, val);
    }
  }
}
