import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdfEditorContentComponent } from './ddf-editor-content.component';

describe('DdfEditorContentComponent', () => {
  let component: DdfEditorContentComponent;
  let fixture: ComponentFixture<DdfEditorContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdfEditorContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdfEditorContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
