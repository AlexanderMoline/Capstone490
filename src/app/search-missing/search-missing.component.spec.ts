import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMissingComponent } from './search-missing.component';

describe('SearchMissingComponent', () => {
  let component: SearchMissingComponent;
  let fixture: ComponentFixture<SearchMissingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMissingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchMissingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
