import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Type(() => Number)
  public price: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  public quantity: number;

  @IsString()
  public image: string;

  @IsBoolean()
  public is_active: boolean;
}
