import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDualViewComponent } from './list-dual-view.component';

describe('ListDualViewComponent', () => {
  let component: ListDualViewComponent;
  let fixture: ComponentFixture<ListDualViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDualViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDualViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
