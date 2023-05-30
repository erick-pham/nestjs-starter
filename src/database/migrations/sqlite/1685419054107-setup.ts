import { MigrationInterface, QueryRunner } from "typeorm";

export class Setup1685419054107 implements MigrationInterface {
    name = 'Setup1685419054107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounts" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "type" varchar NOT NULL, "provider" varchar(255) NOT NULL, "provider_account_id" varchar(255) NOT NULL, "createdAt" date NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "api_keys" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "api_key" varchar(255) NOT NULL, "api_secret" varchar(255) NOT NULL, "api_name" varchar(255) NOT NULL, "is_revoked" boolean NOT NULL DEFAULT (0), "scopes" text, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime DEFAULT (datetime('now')), "deleted_at" datetime, "expired_at" datetime, CONSTRAINT "UQ_9ccce5863aec84d045d778179de" UNIQUE ("api_key"), CONSTRAINT "UQ_eb116fe1e3bd2e9ab954a0c2486" UNIQUE ("api_secret"))`);
        await queryRunner.query(`CREATE TABLE "verification_tokens" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar(255) NOT NULL, "identifier" varchar(255) NOT NULL, "is_expired" boolean NOT NULL DEFAULT (0), "expires" datetime NOT NULL, CONSTRAINT "UQ_b00b1be0e5a820594d7c07a3dfb" UNIQUE ("token"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar(255), "name" varchar(255), "firstName" varchar(255), "lastName" varchar(255), "password" varchar(255), "status" varchar DEFAULT ('inactive'), "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), "deletedAt" date, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "verification_tokens"`);
        await queryRunner.query(`DROP TABLE "api_keys"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
    }

}
