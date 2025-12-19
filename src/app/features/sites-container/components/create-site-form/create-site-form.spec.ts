import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSiteForm } from './create-site-form';

describe('CreateSiteForm', () => {
  let component: CreateSiteForm;
  let fixture: ComponentFixture<CreateSiteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSiteForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSiteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

