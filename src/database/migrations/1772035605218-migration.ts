import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772035605218 implements MigrationInterface {
    name = 'Migration1772035605218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "follows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "followerId" uuid, "followingId" uuid, CONSTRAINT "UQ_105079775692df1f8799ed0fac8" UNIQUE ("followerId", "followingId"), CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_fdb91868b03a2040db408a53331"`);
        await queryRunner.query(`DROP TABLE "follows"`);
    }

}
