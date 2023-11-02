import { AbstractDocument } from "@app/common/database";
import { AbstractRepository } from "@app/common/database/abstract.repository";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ReservationDocument } from "./models/reservation.schema";
import { Mode } from "fs";
import { Model } from "mongoose";

@Injectable()
export class ReservationsRepository extends AbstractRepository<ReservationDocument> {
  protected readonly logger = new Logger(ReservationsRepository.name);

  constructor(
    @InjectModel(ReservationDocument.name)
    reservationModel: Model<ReservationDocument>
  ) {
    super(reservationModel);
  }

}