import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../../websites/header/header';
import { FooterComponent } from '../../websites/footer/footer';

@Component({
  selector: 'app-website-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './website-layout.html',
  styleUrl: './website-layout.scss'
})
export class WebsiteLayout {}