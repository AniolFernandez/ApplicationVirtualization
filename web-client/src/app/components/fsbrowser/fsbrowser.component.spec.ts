import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FsbrowserComponent } from './fsbrowser.component';

describe('FsbrowserComponent', () => {
  let component: FsbrowserComponent;
  let fixture: ComponentFixture<FsbrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FsbrowserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FsbrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
