import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalRolesService } from './professional-roles.service';

describe('ProfessionalRolesService', () => {
  let service: ProfessionalRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessionalRolesService],
    }).compile();

    service = module.get<ProfessionalRolesService>(ProfessionalRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
