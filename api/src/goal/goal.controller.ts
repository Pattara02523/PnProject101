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
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalResponseDto } from './dto/goal-response.dto';
import { GoalService } from './goal.service';

@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateGoalDto
  ): Promise<GoalResponseDto> {
    return this.goalService.create(userId, dto);
  }

  @Get()
  async findAll(
    @CurrentUser('sub') userId: string
  ): Promise<GoalResponseDto[]> {
    return this.goalService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<GoalResponseDto> {
    return this.goalService.findOne(userId, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGoalDto
  ): Promise<GoalResponseDto> {
    return this.goalService.update(userId, id, dto);
  }

  @Delete(':id')
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.goalService.delete(userId, id);
    return { message: 'ลบเป้าหมายทางการเงินสำเร็จ' };
  }
}
