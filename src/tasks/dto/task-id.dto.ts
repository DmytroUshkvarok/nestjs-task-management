import { IsString, IsUUID } from 'class-validator';
export class TaskIdDto {
  @IsString()
  @IsUUID(4)
  id: string;
}
