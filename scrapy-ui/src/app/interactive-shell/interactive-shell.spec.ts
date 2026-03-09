import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { InteractiveShellComponent } from './interactive-shell';

describe('InteractiveShellComponent', () => {
  let component: InteractiveShellComponent;
  let fixture: ComponentFixture<InteractiveShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractiveShellComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractiveShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
