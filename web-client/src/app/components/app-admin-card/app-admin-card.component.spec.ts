import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAdminCardComponent } from './app-admin-card.component';

describe('AppAdminCardComponent', () => {
  let component: AppAdminCardComponent;
  let fixture: ComponentFixture<AppAdminCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAdminCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppAdminCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
