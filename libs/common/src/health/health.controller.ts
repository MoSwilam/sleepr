import { Controller, Get } from "@nestjs/common";
import { ApiTags } from '@nestjs/swagger';


@Controller('/')
export class HealthController {
  @Get()
  healthCheck() {
    return true;
  }
}