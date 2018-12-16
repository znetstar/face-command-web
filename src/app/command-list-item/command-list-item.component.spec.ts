import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandListItemComponent } from './command-list-item.component';

describe('CommandListItemComponent', () => {
  let component: CommandListItemComponent;
  let fixture: ComponentFixture<CommandListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
