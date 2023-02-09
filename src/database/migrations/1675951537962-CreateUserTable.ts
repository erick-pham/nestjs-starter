import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1675951537962 implements MigrationInterface {
    name = 'CreateUserTable1675951537962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar(255), "name" varchar(255), "firstName" varchar(255), "lastName" varchar(255), "status" varchar NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
