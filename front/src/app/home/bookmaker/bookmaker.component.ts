import { Component, OnInit, Input  } from '@angular/core';

@Component({
  selector: 'app-bookmaker',
  templateUrl: './bookmaker.component.html',
  styleUrls: ['./bookmaker.component.scss']
})
export class BookmakerComponent implements OnInit {
  @Input() parentData:any;
  public data:any;
  public team:any;

  constructor() { }

  ngOnInit(): void {
    for(var x in this.parentData.markets) {
      switch(this.parentData.markets[x].key) {
        case 'h2h':
          this.parentData.markets[x].market_title = 'Win'
          break
        case 'h2h_lay':
          this.parentData.markets[x].market_title = 'Win(lay)'
          break
        case 'spread':
          this.parentData.markets[x].market_title = 'Line'
          break
        case 'h2h':
          this.parentData.markets[x].market_title = 'Total Points'
          break
      }
    }
  }

}
