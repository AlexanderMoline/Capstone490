import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComparisonComponent } from './search-comparison.component';

describe('SearchComparisonComponent', () => {
  let component: SearchComparisonComponent;
  let fixture: ComponentFixture<SearchComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
