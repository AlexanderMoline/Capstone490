import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-search-unidentified',
  imports: [ RouterLink, ReactiveFormsModule ],
  templateUrl: './search-unidentified.component.html',
  styleUrl: './search-unidentified.component.css'
})
export class SearchUnidentifiedComponent {
  constructor(private backendService: BackendService) { }

  private searchParams: Map<string, string> = new Map();

  search = new FormGroup({
    namusNum: new FormControl(''),
    ncmecNum: new FormControl(''),
    ageFrom: new FormControl(''),
    ageTo: new FormControl(''),
    sex: new FormControl(''),
    race: new FormControl(''),
    date: new FormControl(''),
    state: new FormControl(''),
    city: new FormControl(''),
    county: new FormControl('')
  });

  onSubmit() {
    this.searchParams.clear();
    this.addControlToSearch('namusNum', 'namus_number');
    this.addControlToSearch('caseNum', 'case_number')
    this.addControlToSearch('ncmecNum', 'ncmec_number');
    this.addControlToSearch('sex', 'biological_sex');
    this.addControlToSearch('race', 'race_ethnicity');
    this.addControlToSearch('ageFrom', 'age_from');
    this.addControlToSearch('ageTo', 'age_to');
    this.addControlToSearch('state', 'state');
    this.addControlToSearch('city', 'city');
    this.addControlToSearch('county', 'county');
    var url = this.backendService.constructSearchUrl(this.searchParams);
    console.log(url);
    this.backendService.getData(url);
  }
  
  private addControlToSearch(controlName: string, parameterName: string) {
    var controlValue = this.search.get(controlName)?.value;

    if (controlValue != null) { this.searchParams.set(parameterName, controlValue); }
  }
}
