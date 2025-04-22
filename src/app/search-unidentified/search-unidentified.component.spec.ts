import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUnidentifiedComponent } from './search-unidentified.component';

describe('SearchUnidentifiedComponent', () => {
  let component: SearchUnidentifiedComponent;
  let fixture: ComponentFixture<SearchUnidentifiedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchUnidentifiedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchUnidentifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
