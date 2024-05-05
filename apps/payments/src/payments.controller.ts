import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  PaymentServiceControllerMethods,
  PaymentServiceController,
} from '@app/common';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller()
@PaymentServiceControllerMethods()
export class PaymentsController implements PaymentServiceController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UsePipes(new ValidationPipe())
  async createCharge(data: PaymentsCreateChargeDto) {
    // console.log({ dataFromPaymentsController: data });
    return this.paymentsService.createCharge(data);
  }
}
