import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualDetailViewComponent } from './dual-detail-view.component';

describe('DualDetailViewComponent', () => {
  let component: DualDetailViewComponent;
  let fixture: ComponentFixture<DualDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DualDetailViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DualDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
