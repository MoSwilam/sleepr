import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CardDto } from "../../../../libs/common/src/dto/card.dto";
import { CreateChargeDto } from "@app/common";

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;
}
