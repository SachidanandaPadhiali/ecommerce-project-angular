import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerOrder } from './seller-order';

describe('SellerOrder', () => {
  let component: SellerOrder;
  let fixture: ComponentFixture<SellerOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
