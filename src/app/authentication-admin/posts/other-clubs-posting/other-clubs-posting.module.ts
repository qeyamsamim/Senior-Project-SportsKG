import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { OtherClubsPostingPageRoutingModule } from './other-clubs-posting-routing.module';

import { OtherClubsPostingPage } from './other-clubs-posting.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    OtherClubsPostingPageRoutingModule,
    SharedModule
  ],
  declarations: [OtherClubsPostingPage]
})
export class OtherClubsPostingPageModule {}
