import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScoreAddPageRoutingModule } from './score-add-routing.module';

import { ScoreAddPage } from './score-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScoreAddPageRoutingModule
  ],
  declarations: [ScoreAddPage]
})
export class ScoreAddPageModule {}
