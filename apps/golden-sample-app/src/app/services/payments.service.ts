import { Injectable } from '@angular/core';
import {
  PaymentOrdersHttpService as PaymentOrdersService,
  PaymentOrdersValidatePost,
  PaymentOrdersValidatePostResponse
} from '@backbase/data-ang/payment-order';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  constructor(private readonly paymentOrderData: PaymentOrdersService) {}

  // todo: hardcoded data for the of the service availability
  public paymentForValidation: PaymentOrdersValidatePost = {
    originatorAccount: {
      identification: {
        identification: 'sdbx-prd-021000025',
        schemeName: 'BBAN',
      },
    },
    batchBooking: false,
    requestedExecutionDate: '23-12-2022',
    paymentMode: 'SINGLE',
    paymentType: 'INTERNAL_TRANSFER',
    transferTransactionInformation: {
      counterparty: {
        name: 'Backbase Backbase Backbase Backbase Backbase',
        postalAddress: {
          addressLine1: 'Jacob Bontiusplaats 9',
          town: 'Amsterdam',
          postCode: '1018LL',
          country: 'NL',
        },
      },
      counterpartyAccount: {
        identification: {
          identification: 'sdbx-prd-021000027',
          schemeName: 'BBAN',
        },
      },
      counterpartyBank: {
        postalAddress: {
          addressLine1: '368 Gulgowski Knoll, Suite 740, 96665',
          addressLine2: 'Lake Garthchester',
          town: 'Iowa',
          postCode: '3028 Lang Lakes',
          country: 'USA',
        },
      },
      instructedAmount: {
        amount: '100',
        currencyCode: 'USD',
      },
      remittanceInformation: 'Salary',
    },
  };

  public checkValidatePayment(
    payment: PaymentOrdersValidatePost
  ): Observable<PaymentOrdersValidatePostResponse> {
    return this.paymentOrderData
      .postValidate({ paymentOrdersValidatePost: payment }, 'response')
      .pipe(
        map((response) => {
          if (response.body === null) {
            throw Error('body is null');
          }

          return response.body;
        })
      );
  }

  // todo: add request here
  checkPaymentEdnpoint() {}
}
