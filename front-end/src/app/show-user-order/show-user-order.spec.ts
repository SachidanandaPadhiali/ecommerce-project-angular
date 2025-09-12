import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUserOrder } from './show-user-order';

describe('ShowUserOrder', () => {
  let component: ShowUserOrder;
  let fixture: ComponentFixture<ShowUserOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowUserOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowUserOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
