import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'),
  {
    apiVersion: '2023-10-16',
  });

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsClient: ClientProxy) {}

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    try {
      // const paymentMethod = await this.stripe.paymentMethods.create({
      //   type: 'card',
      //   card
      // });

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        payment_method: 'pm_card_visa',
        confirm: true,
        payment_method_types: ['card'],
      });

      this.notificationsClient.emit('notify_email', { email });

      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
