import { Component, OnInit } from '@angular/core';
import { DateRange } from 'igniteui-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public range: DateRange = { start: new Date(), end: new Date(new Date().setDate(new Date().getDate() + 5)) };
  public screenWidth: any;

  constructor() { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth - 80;
  }

}
