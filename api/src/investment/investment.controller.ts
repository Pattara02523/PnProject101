import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { ListInvestmentQueryDto } from './dto/list-investment-query.dto';
import {
  InvestmentResponseDto,
  PaginatedInvestmentResponseDto
} from './dto/investment-response.dto';
import { InvestmentService } from './investment.service';

@ApiTags('Investments')
@ApiBearerAuth('JWT-auth')
@Controller('investments')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new investment asset (สร้างรายการลงทุนใหม่)' })
  @ApiResponse({ status: 201, description: 'Investment created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateInvestmentDto
  ): Promise<InvestmentResponseDto> {
    return this.investmentService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List and filter investments (ค้นหาและกรองรายการลงทุนทั้งหมด)' })
  @ApiResponse({ status: 200, description: 'Paginated list of investments returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(
    @CurrentUser('sub') userId: string,
    @Query() query: ListInvestmentQueryDto
  ): Promise<PaginatedInvestmentResponseDto> {
    return this.investmentService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of an investment (ดูข้อมูลรายการลงทุนเดี่ยวตาม ID)' })
  @ApiResponse({ status: 200, description: 'Investment details returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Investment not found.' })
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<InvestmentResponseDto> {
    return this.investmentService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an investment (แก้ไขรายการลงทุน)' })
  @ApiResponse({ status: 200, description: 'Investment updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Investment not found.' })
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInvestmentDto
  ): Promise<InvestmentResponseDto> {
    return this.investmentService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an investment (ลบรายการลงทุน)' })
  @ApiResponse({ status: 200, description: 'Investment deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Investment not found.' })
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.investmentService.delete(userId, id);
    return { message: 'Investment deleted successfully (ลบรายการลงทุนสำเร็จ)' };
  }
}
