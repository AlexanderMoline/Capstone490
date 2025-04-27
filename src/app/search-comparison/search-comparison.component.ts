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
  // our backing Map<queryParam, value>
  private searchParams = new Map<string, string>();

  // formGroup matching the inputs in your HTML
  search = new FormGroup({
    state: new FormControl(''),
    county: new FormControl(''),
    city: new FormControl(''),
    sex: new FormControl(''),
    race: new FormControl(''),
    missingFrom: new FormControl(''),
    missingTo: new FormControl(''),
    bodyFoundFrom: new FormControl(''),
    bodyFoundTo: new FormControl(''),
  });

  constructor(private backendService: BackendService) {}

  onSubmit() {
    this.searchParams.clear();

    // map form fields → your server’s query‐string names
    this.addControlToSearch('state', 'state');
    this.addControlToSearch('county', 'county');
    this.addControlToSearch('city', 'city');
    this.addControlToSearch('sex', 'biological_sex');
    this.addControlToSearch('race', 'race_ethnicity');

    // for missing-AGE range, your server uses age_from / age_to
    this.addControlToSearch('missingFrom', 'age_from');
    this.addControlToSearch('missingTo', 'age_to');

    // if you want to filter by body‐found-year range,
    // map those to missing_age (or adapt your server accordingly)
    // this.addControlToSearch('bodyFoundFrom','missing_age');
    // this.addControlToSearch('bodyFoundTo',  'missing_age');

    const url = this.backendService.constructSearchUrl(
      this.searchParams,
      'persons',
    );
    console.log('🔍 comparison URL =', url);

    // reuse your existing getData (it sets the service’s result Observable)
    this.backendService.getData(url);
  }

  private addControlToSearch(ctrl: string, param: string) {
    const val = this.search.get(ctrl)?.value;
    if (val !== null && val !== '') {
      this.searchParams.set(param, val);
    }
  }
}
