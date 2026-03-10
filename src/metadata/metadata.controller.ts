import { Controller, Get } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Metadata')
@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get('register')
  getRegisterMetadata() {
    return this.metadataService.getRegisterMetadata();
  }
}
