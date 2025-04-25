import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-search-comparison',
  imports: [ RouterLink, ReactiveFormsModule ],
  templateUrl: './search-comparison.component.html',
})
export class SearchComparisonComponent {
  search = new FormGroup({});

  onSubmit() {
    
  }
}
