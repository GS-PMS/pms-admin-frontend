import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesGrid } from './sites-grid';

describe('SitesGrid', () => {
  let component: SitesGrid;
  let fixture: ComponentFixture<SitesGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SitesGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SitesGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
