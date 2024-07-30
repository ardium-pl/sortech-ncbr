import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyTableComponent } from './hourly-table.component';

describe('HourlyTableComponent', () => {
  let component: HourlyTableComponent;
  let fixture: ComponentFixture<HourlyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourlyTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HourlyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
