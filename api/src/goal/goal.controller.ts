import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalResponseDto } from './dto/goal-response.dto';
import { GoalService } from './goal.service';

@ApiTags('Goals')
@ApiBearerAuth('JWT-auth')
@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a financial goal (สร้างเป้าหมายการเงินใหม่)' })
  @ApiResponse({ status: 201, description: 'Goal created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateGoalDto
  ): Promise<GoalResponseDto> {
    return this.goalService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all user financial goals (ดูรายการเป้าหมายทั้งหมดของฉัน)' })
  @ApiResponse({ status: 200, description: 'List of goals returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(
    @CurrentUser('sub') userId: string
  ): Promise<GoalResponseDto[]> {
    return this.goalService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a financial goal (ดูข้อมูลเป้าหมายเดี่ยวตาม ID)' })
  @ApiResponse({ status: 200, description: 'Goal details returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Goal not found.' })
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<GoalResponseDto> {
    return this.goalService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a financial goal (แก้ไขข้อมูลเป้าหมาย)' })
  @ApiResponse({ status: 200, description: 'Goal updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Goal not found.' })
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGoalDto
  ): Promise<GoalResponseDto> {
    return this.goalService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a financial goal (ลบเป้าหมายการเงิน)' })
  @ApiResponse({ status: 200, description: 'Goal deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Goal not found.' })
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.goalService.delete(userId, id);
    return { message: 'Financial goal deleted successfully (ลบเป้าหมายทางการเงินสำเร็จ)' };
  }
}
