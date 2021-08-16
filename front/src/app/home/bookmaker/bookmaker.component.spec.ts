import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmakerComponent } from './bookmaker.component';

describe('BookmakerComponent', () => {
  let component: BookmakerComponent;
  let fixture: ComponentFixture<BookmakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmakerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
