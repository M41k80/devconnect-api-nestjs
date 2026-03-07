import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772766564024 implements MigrationInterface {
    name = 'Migration1772766564024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "professional_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, CONSTRAINT "UQ_753741a94d79b727318c919d1f9" UNIQUE ("name"), CONSTRAINT "PK_f6bf8ea1a985718ccad37de7909" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_81f05095507fd84aa2769b4a522" UNIQUE ("name"), CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_skills" ("usersId" uuid NOT NULL, "skillsId" uuid NOT NULL, CONSTRAINT "PK_a1956708fe44a84d2d858f76d74" PRIMARY KEY ("usersId", "skillsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_19ca921ee3aaf5e04b07d1d74e" ON "user_skills" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0c3eeaeb05e6b3b509e3135bbc" ON "user_skills" ("skillsId") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "github" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "portfolio" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "linkedin" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "professional_role_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_8f12f7a60fa8c8f995658d88d3b" FOREIGN KEY ("professional_role_id") REFERENCES "professional_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_19ca921ee3aaf5e04b07d1d74e2" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_0c3eeaeb05e6b3b509e3135bbcb" FOREIGN KEY ("skillsId") REFERENCES "skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_0c3eeaeb05e6b3b509e3135bbcb"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_19ca921ee3aaf5e04b07d1d74e2"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_8f12f7a60fa8c8f995658d88d3b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "professional_role_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "linkedin"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "portfolio"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "github"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c3eeaeb05e6b3b509e3135bbc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19ca921ee3aaf5e04b07d1d74e"`);
        await queryRunner.query(`DROP TABLE "user_skills"`);
        await queryRunner.query(`DROP TABLE "skills"`);
        await queryRunner.query(`DROP TABLE "professional_roles"`);
    }

}
