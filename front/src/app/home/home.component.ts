import { Component, OnInit } from '@angular/core';
import { DateRange } from 'igniteui-angular';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public range: DateRange = { start: new Date(), end: new Date(new Date().setDate(new Date().getDate() + 5)) };
  public screenWidth: any;
  public screenHeight: any;
  
  public events: any;

  constructor(private http: HttpClient) {
    this.http.get('/api/events').subscribe((data: any)=>{
      console.log(data)
      var tmp_len = data.length
      var tmp_i = 0
      for (;tmp_i < tmp_len; tmp_i++) {
        var str = data[tmp_i].sport_key
        var tmp_arr = str.split('_')
        var arr_len = tmp_arr.length
        var full_name = ''
        for(var tmp_j=0; tmp_j<arr_len; tmp_j ++) {
          if (full_name!='') full_name += ' ';
          full_name += tmp_arr[tmp_j].charAt(0).toUpperCase() + tmp_arr[tmp_j].slice(1);
        }
        data[tmp_i].sport_key = full_name

        data[tmp_i].commence_time = data[tmp_i].commence_time.replace(/T/g, ' ')
        data[tmp_i].commence_time = data[tmp_i].commence_time.replace(/Z/g, '')
      }
      this.events = data
    })
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth - 80;
    this.screenHeight = window.innerHeight - 85;
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
