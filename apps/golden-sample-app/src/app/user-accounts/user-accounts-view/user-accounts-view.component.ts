import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../../services/payments.service';
import { UserAccountsService } from '../user-accounts.service';

@Component({
  selector: 'app-user-accounts-view',
  templateUrl: './user-accounts-view.component.html',
})
export class UserAccountsViewComponent implements OnInit {
  public arrangements$ = this.userAccountsService.arrangements$;

  constructor(
    private readonly userAccountsService: UserAccountsService,
    private readonly payments: PaymentsService,
  ) {}

  ngOnInit(): void {
    this.payments.checkValidatePayment(this.payments.paymentForValidation).subscribe(v => console.log(v));
      
  }
}
