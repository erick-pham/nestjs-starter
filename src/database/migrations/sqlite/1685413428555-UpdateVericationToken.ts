import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateVericationToken1685413428555 implements MigrationInterface {
  name = 'UpdateVericationToken1685413428555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_verification_tokens" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar(255) NOT NULL, "identifier" varchar(255) NOT NULL, "expires" datetime NOT NULL, "is_expired" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_b00b1be0e5a820594d7c07a3dfb" UNIQUE ("token"))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_verification_tokens"("id", "token", "identifier", "expires") SELECT "id", "token", "identifier", "expires" FROM "verification_tokens"`
    );
    await queryRunner.query(`DROP TABLE "verification_tokens"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_verification_tokens" RENAME TO "verification_tokens"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verification_tokens" RENAME TO "temporary_verification_tokens"`
    );
    await queryRunner.query(
      `CREATE TABLE "verification_tokens" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar(255) NOT NULL, "identifier" varchar(255) NOT NULL, "expires" datetime NOT NULL, CONSTRAINT "UQ_b00b1be0e5a820594d7c07a3dfb" UNIQUE ("token"))`
    );
    await queryRunner.query(
      `INSERT INTO "verification_tokens"("id", "token", "identifier", "expires") SELECT "id", "token", "identifier", "expires" FROM "temporary_verification_tokens"`
    );
    await queryRunner.query(`DROP TABLE "temporary_verification_tokens"`);
  }
}
