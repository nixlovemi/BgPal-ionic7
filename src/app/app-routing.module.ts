import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'score',
    pathMatch: 'full'
  },
  {
    path: 'score',
    loadChildren: () => import('./pages/score/score.module').then( m => m.ScorePageModule)
  },
  {
    path: 'score-details/:scoreIdx',
    loadChildren: () => import('./pages/score-details/score-details.module').then( m => m.ScoreDetailsPageModule)
  },
  {
    path: 'score-add',
    loadChildren: () => import('./pages/score-add/score-add.module').then( m => m.ScoreAddPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
