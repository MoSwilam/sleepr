import { CardDto } from './card.dto';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChargeRequest } from '../types';

export class CreateChargeDto implements Omit<ChargeRequest, 'email'> {
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;

  /**
   * amount to be charged
   */
  @IsNumber()
  amount: number;
}
