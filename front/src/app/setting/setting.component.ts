import { Component, OnInit } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  public screenWidth: any;
  public toppings = new FormControl();
  public toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  public sports = new FormControl();
  public sportLists: string[] = []
  public regions = new FormControl();
  public regionLists: string[] = ['uk', 'us', 'eu', 'au']
  public markets = new FormControl();
  public marketLists: string[] = ['h2h', 'spreads', 'totals']
  public odd = new FormControl();
  public odds: string[] = ['decimal', 'american']
  public dateformat = new FormControl();
  public dateformats: string[] = ['iso', 'unix']

  public email = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl();
  public hide: boolean = true;
  public api_key = new FormControl();

  public prd1 = new FormControl();
  public prd2 = new FormControl();
  public trigger = new FormControl();

  constructor(private http: HttpClient) {
    this.http.get('/api/setting').subscribe((data: any)=>{
      this.email.setValue(data.mail)
      this.password.setValue(data.password)
      this.api_key.setValue(data.apikey)
      this.sports.setValue(data.sportKey)
      this.regions.setValue(data.regions)
      this.markets.setValue(data.markets)
      this.odd.setValue(data.oddsFormat)
      this.dateformat.setValue(data.dateFormat)
      this.prd1.setValue(data.prd1)
      this.prd2.setValue(data.prd2)
      this.trigger.setValue(data.trigger)
    })
    this.http.get('/api/sports').subscribe((data: any)=>{
      this.sportLists = data
    })
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth - 80;
  }

  onSave() {
    this.http.post(
      '/api/setting',
      {
        'mail' : this.email.value,
        'password' : this.password.value,
        'apikey' : this.api_key.value,
        'sportKey' : this.sports.value,
        'regions' : this.regions.value,
        'markets' : this.markets.value,
        'oddsFormat' : this.odd.value,
        'dateFormat' : this.dateformat.value,
        'prd1' : this.prd1.value,
        'prd2' : this.prd2.value,
        'trigger' : this.trigger.value
      }
    ).subscribe((data: any)=>{})
  }

  onRefresh() {
    this.http.post('/api/sports', {}).subscribe((data: any)=>{
      this.sportLists = data
    })
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
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
