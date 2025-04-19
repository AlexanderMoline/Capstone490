import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-search-missing',
  imports: [ RouterLink, ReactiveFormsModule ],
  templateUrl: './search-missing.component.html',
  styleUrl: './search-missing.component.css'
})
export class SearchMissingComponent {
  constructor(private backendService: BackendService) { }

  private searchParams: Map<string, string> = new Map();

  search = new FormGroup({
    namusNum: new FormControl(''),
    ncmecNum: new FormControl(''),
    firstName: new FormControl(''),
    middleName: new FormControl(''),
    lastName: new FormControl(''),
    ageCurrent: new FormControl(''),
    ageMissing: new FormControl(''),
    sex: new FormControl(''),
    race: new FormControl(''),
    tribalAffiliation: new FormControl(''),
    dateLastContact: new FormControl(''),
    stateLast: new FormControl(''),
    cityLast: new FormControl(''),
    countyLast: new FormControl('')
  });

  onSubmit() {
    this.searchParams.clear();
    this.addControlToSearch('namusNum', 'case_number');
    this.addControlToSearch('ncmecNum', 'ncmec_number')
    this.addControlToSearch('firstName', 'first_name');
    this.addControlToSearch('middleName', 'middle_name');
    this.addControlToSearch('lastName', 'last_name');
    this.addControlToSearch('sex', 'biological_sex');
    this.addControlToSearch('race', 'race_ethnicity');
    this.addControlToSearch('tribalAffiliation', 'tribal_affiliation');
    this.addControlToSearch('ageMissing', 'missing_age');
    this.addControlToSearch('ageCurrent', 'current_age');
    this.addControlToSearch('stateLast', 'state');
    this.addControlToSearch('cityLast', 'city');
    this.addControlToSearch('countyLast', 'county');
    var url = this.backendService.constructSearchUrl(this.searchParams);
    console.log(url);
    this.backendService.getData(url);
  }
  
  private addControlToSearch(controlName: string, parameterName: string) {
    var controlValue = this.search.get(controlName)?.value;

    if (controlValue != null) { this.searchParams.set(parameterName, controlValue); }
  }
}
