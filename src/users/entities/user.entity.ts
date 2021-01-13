import { CoreEntity } from "../../common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";
import { IsEmail, IsEnum } from "class-validator";

// TypeScript Enum 적용
enum UserRole {
  Host,
  Listener,
}

// GraphQL Enum 적용
registerEnumType(UserRole, {name: "UserRole"})

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsEmail()
  email: string;

  @Column()
  @Field(type => String)
  password: string;

  @Column({type: 'enum', enum: UserRole})
  @Field(type => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  // TypeORM Listener! (user.save() 에서 instance를 DB에 저장하기 전에 수행됨.)
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch(e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string) : Promise<Boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}