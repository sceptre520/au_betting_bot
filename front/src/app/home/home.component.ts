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
  public range: DateRange = { start: new Date(), end: new Date(new Date().setDate(new Date().getDate() + 3)) };
  public screenWidth: any;
  public screenHeight: any;
  
  public events: any;
  public start_time: string = '';
  public end_time: string = '';

  constructor(private http: HttpClient) {
    this.start_time = this.convertDateToStr(new Date())
    this.start_time += 'T00:00:00Z'
    this.end_time = this.convertDateToStr(new Date(new Date().setDate(new Date().getDate() + 3)))
    this.end_time += 'T23:59:59Z'
    this._getEvents()
    this.http.get('/api/apilog').subscribe((data: any)=>{
      console.log(data)
    })
    
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth - 80;
    this.screenHeight = window.innerHeight - 85;
  }

  onForce() {
    this.http.post('/api/forceevents', {'start':this.start_time, 'end':this.end_time}).subscribe((data: any)=>{})
  }

  modelRangeChange(event:any) {
    this.start_time = this.convertDateToStr(event.start)
    this.end_time = this.convertDateToStr(event.end)
    this.start_time += 'T00:00:00Z'
    this.end_time += 'T23:59:59Z'
    this._getEvents()
  }

  convertDateToStr(dateObj:Date) {
    var mm = dateObj.getMonth() + 1; // getMonth() is zero-based
    var dd = dateObj.getDate();

    return [dateObj.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
          ].join('-');
  }

  _getEvents() {
    this.http.post('/api/events', {'start':this.start_time, 'end':this.end_time}).subscribe((data: any)=>{
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
