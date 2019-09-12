import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigtoolComponent } from './configtool.component';

describe('ConfigtoolComponent', () => {
  let component: ConfigtoolComponent;
  let fixture: ComponentFixture<ConfigtoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigtoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigtoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
