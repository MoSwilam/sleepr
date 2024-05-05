import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  NOTIFICATION_SERVICE_NAME,
  NotificationServiceClient,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private notificationsService: NotificationServiceClient;
  private secretKey = this.configService.get('STRIPE_SECRET_KEY');
  private readonly stripe = new Stripe(this.secretKey, {
    apiVersion: '2023-10-16',
  });

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATION_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    try {
      // const paymentMethod = await this.stripe.paymentMethods.create({
      //   type: 'card',
      //   card
      // });

      if (!this.notificationsService) {
        this.notificationsService =
          this.client.getService<NotificationServiceClient>(
            NOTIFICATION_SERVICE_NAME,
          );
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        payment_method: 'pm_card_visa',
        confirm: true,
        payment_method_types: ['card'],
      });

      this.notificationsService
        .notifyEmail({ email, text: 'payment made' })
        .subscribe(() => {
          console.log(
            'email sent using grpc call from payments service to notifications service',
          );
        });

      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
