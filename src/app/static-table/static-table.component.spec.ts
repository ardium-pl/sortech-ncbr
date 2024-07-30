import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticTableComponent } from './static-table.component';

describe('StaticTableComponent', () => {
  let component: StaticTableComponent;
  let fixture: ComponentFixture<StaticTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaticTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
