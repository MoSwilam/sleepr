import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CardDto } from "./card.dto";

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsString()
  @IsNotEmpty()
  invoiceId: string;

  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  card: CardDto;

  @IsNotEmpty()
  amount: number;
}
