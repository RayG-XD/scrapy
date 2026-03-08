import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spiders } from './spiders';

describe('Spiders', () => {
  let component: Spiders;
  let fixture: ComponentFixture<Spiders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spiders],
    }).compileComponents();

    fixture = TestBed.createComponent(Spiders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
