import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.product.count({
      where: { is_active: true },
    });
    const lastPages = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { is_active: true },
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPages,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, is_active: true },
    });
    if (!product)
      throw new RpcException({
        message: `Product with ${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { ...data } = updateProductDto;

    const product = await this.findOne(id);

    if (!product) throw new NotFoundException(`Product with ${id} not found`);

    return this.product.update({ where: { id }, data: data });
  }

  async remove(id: number) {
    this.findOne(id);
    const product = await this.product.update({
      where: { id },
      data: {
        is_active: false,
      },
    });
    return product;
  }

  async validateProduct(ids: number[]) {
    //hacer consulta de id unicos
    ids = Array.from(new Set(ids));
    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (products.length !== ids.length)
      throw new RpcException({
        message: `Product with ${ids} not found`,
        status: HttpStatus.BAD_REQUEST,
      });

    return products;
  }
}
//false: eliminado
