import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FourthExcerciseComponent } from './fourth-excercise.component';

describe('FourthExcerciseComponent', () => {
  let component: FourthExcerciseComponent;
  let fixture: ComponentFixture<FourthExcerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FourthExcerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FourthExcerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
