import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreAddPage } from './score-add.page';

describe('ScoreAddPage', () => {
  let component: ScoreAddPage;
  let fixture: ComponentFixture<ScoreAddPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ScoreAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
