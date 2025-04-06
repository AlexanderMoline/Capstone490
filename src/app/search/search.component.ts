import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-search',
  imports: [ RouterLink, ReactiveFormsModule ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  constructor(private backendService: BackendService) { }

  private searchParams: Map<string, string> = new Map();

  search = new FormGroup({
    namusNum: new FormControl(''),
    ncmecNum: new FormControl(''),
    firstName: new FormControl(''),
    middleName: new FormControl(''),
    lastName: new FormControl(''),
    nickname: new FormControl(''),
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
    this.addControlToSearch('state', 'stateLast');
    this.addControlToSearch('city', 'cityLast');
    var url = this.backendService.constructSearchMissingUrl(this.searchParams);
    console.log(url);
    this.backendService.getData(url);
  }
  
  private addControlToSearch(parameterName: string, controlName: string) {
    var controlValue = this.search.get(controlName)?.value;

    if (controlValue != null) { this.searchParams.set(parameterName, controlValue); }
  }
}
