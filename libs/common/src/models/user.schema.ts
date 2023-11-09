import { AbstractDocument } from "@app/common/database";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: 'users' })
export class UserDocument extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);