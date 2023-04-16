import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerAdminComponent } from './server-admin.component';

describe('ServerAdminComponent', () => {
  let component: ServerAdminComponent;
  let fixture: ComponentFixture<ServerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
