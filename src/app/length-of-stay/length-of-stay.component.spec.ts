import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LengthOfStayComponent } from './length-of-stay.component';

describe('LengthOfStayComponent', () => {
  let component: LengthOfStayComponent;
  let fixture: ComponentFixture<LengthOfStayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LengthOfStayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LengthOfStayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
