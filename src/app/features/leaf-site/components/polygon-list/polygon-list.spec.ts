import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonList } from './polygon-list';

describe('PolygonList', () => {
  let component: PolygonList;
  let fixture: ComponentFixture<PolygonList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolygonList],
    }).compileComponents();

    fixture = TestBed.createComponent(PolygonList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
