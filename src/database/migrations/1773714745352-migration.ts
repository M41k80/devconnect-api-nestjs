import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773714745352 implements MigrationInterface {
    name = 'Migration1773714745352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "isActive"`);
    }

}
