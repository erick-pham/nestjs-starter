import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTable1676120407102 implements MigrationInterface {
  name = 'UpdateUserTable1676120407102';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar(255), "name" varchar(255), "firstName" varchar(255), "lastName" varchar(255), "status" varchar DEFAULT ('active'), "password" varchar(255), "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), "deletedAt" date, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_users"("id", "email", "name", "firstName", "lastName", "status") SELECT "id", "email", "name", "firstName", "lastName", "status" FROM "users"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar(255), "name" varchar(255), "firstName" varchar(255), "lastName" varchar(255), "status" varchar DEFAULT ('inactive'), "password" varchar(255), "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), "deletedAt" date, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_users"("id", "email", "name", "firstName", "lastName", "status", "password", "createdAt", "updatedAt", "deletedAt") SELECT "id", "email", "name", "firstName", "lastName", "status", "password", "createdAt", "updatedAt", "deletedAt" FROM "users"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar(255), "name" varchar(255), "firstName" varchar(255), "lastName" varchar(255), "status" varchar DEFAULT ('active'), "password" varchar(255), "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), "deletedAt" date, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `INSERT INTO "users"("id", "email", "name", "firstName", "lastName", "status", "password", "createdAt", "updatedAt", "deletedAt") SELECT "id", "email", "name", "firstName", "lastName", "status", "password", "createdAt", "updatedAt", "deletedAt" FROM "temporary_users"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_users"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar(255), "name" varchar(255), "firstName" varchar(255), "lastName" varchar(255), "status" varchar DEFAULT ('active'), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `INSERT INTO "users"("id", "email", "name", "firstName", "lastName", "status") SELECT "id", "email", "name", "firstName", "lastName", "status" FROM "temporary_users"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_users"`);
  }
}
