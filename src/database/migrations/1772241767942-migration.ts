import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772241767942 implements MigrationInterface {
    name = 'Migration1772241767942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blacklisted_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_8fb1bc7333c3b9f249f9feaa55d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "blacklisted_tokens"`);
    }

}
