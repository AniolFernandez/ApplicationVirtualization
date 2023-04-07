import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAndRolesComponent } from './user-and-roles.component';

describe('UserAndRolesComponent', () => {
  let component: UserAndRolesComponent;
  let fixture: ComponentFixture<UserAndRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAndRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAndRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
