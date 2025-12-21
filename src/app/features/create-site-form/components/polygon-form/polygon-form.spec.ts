import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonForm } from './polygon-form';

describe('PolygonForm', () => {
  let component: PolygonForm;
  let fixture: ComponentFixture<PolygonForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolygonForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PolygonForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
