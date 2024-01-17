import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreDetailsPage } from './score-details.page';

describe('ScoreDetailsPage', () => {
  let component: ScoreDetailsPage;
  let fixture: ComponentFixture<ScoreDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ScoreDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
