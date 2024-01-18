import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Score Aid', url: '/score', icon: 'trophy' },
  ];
  
  constructor(private storage: StorageService) { }
}
