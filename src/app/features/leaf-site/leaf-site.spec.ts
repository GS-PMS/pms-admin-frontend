import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafSite } from './leaf-site';

describe('LeafSite', () => {
  let component: LeafSite;
  let fixture: ComponentFixture<LeafSite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeafSite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeafSite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
