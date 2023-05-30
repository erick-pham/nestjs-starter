import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVericationToken1685412657556 implements MigrationInterface {
  name = 'CreateVericationToken1685412657556';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "verification_tokens" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar(255) NOT NULL, "identifier" varchar(255) NOT NULL, "expires" datetime NOT NULL, CONSTRAINT "UQ_b00b1be0e5a820594d7c07a3dfb" UNIQUE ("token"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "verification_tokens"`);
  }
}
