import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProfileInfoPage } from './edit-profile-info.page';

describe('EditProfileInfoPage', () => {
  let component: EditProfileInfoPage;
  let fixture: ComponentFixture<EditProfileInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
