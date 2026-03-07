import { ProfessionalRole } from 'src/professional-roles/entities/professional-role.entity';
import AppDataSource from '../data-source';
import { Skill } from 'src/skills/entities/skill.entity';

async function seed() {
  await AppDataSource.initialize();

  const professionalRoleRepo = AppDataSource.getRepository(ProfessionalRole);
  const skillRepo = AppDataSource.getRepository(Skill);

  await professionalRoleRepo.save([
    { name: 'Backend Developer' },
    { name: 'Frontend Developer' },
    { name: 'Fullstack Developer' },
    { name: 'UI/UX Designer' },
  ]);

  await skillRepo.save([
    { name: 'JavaScript' },
    { name: 'TypeScript' },
    { name: 'React' },
    { name: 'Node.js' },
    { name: 'Python' },
  ]);

  console.log('Seed completed');

  process.exit();
}

seed();
