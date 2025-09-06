import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerOrderPage } from './seller-order-page';

describe('SellerOrderPage', () => {
  let component: SellerOrderPage;
  let fixture: ComponentFixture<SellerOrderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerOrderPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
