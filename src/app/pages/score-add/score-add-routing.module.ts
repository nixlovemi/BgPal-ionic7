import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScoreAddPage } from './score-add.page';

const routes: Routes = [
  {
    path: '',
    component: ScoreAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreAddPageRoutingModule {}
