import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalRolesController } from './professional-roles.controller';
import { ProfessionalRolesService } from './professional-roles.service';

describe('ProfessionalRolesController', () => {
  let controller: ProfessionalRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalRolesController],
      providers: [ProfessionalRolesService],
    }).compile();

    controller = module.get<ProfessionalRolesController>(ProfessionalRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
