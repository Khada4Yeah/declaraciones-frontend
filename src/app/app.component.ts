import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzIconModule],
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log(this.router.config);
  }
}
