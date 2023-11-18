//respond.controller.ts

import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { Dialogue } from './entities/dialogue.entity';
import { User } from '../users/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('respond')
export class RespondController {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel('Dialogue') private dialogueModel: Model<Dialogue>,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async respond(
    @Body() body: { question: string },
    @Req() req: RequestWithUser,
  ): Promise<any> {
    try {
      const user = req.user;
      console.log('User:', user);
      const fixedDialogueId = 'fixed-dialogue-id'; // Fixed ID for the dialogue

      const apiEndpoint = process.env.API_ENDPOINT;
      if (!apiEndpoint) {
        throw new Error('API_ENDPOINT is not defined in the environment');
      }

      const response = await firstValueFrom(
        this.httpService.post(
          apiEndpoint,
          { query: body.question },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      // Find or create a dialogue
      const dialogue = await this.dialogueModel.findOneAndUpdate(
        { dialogueId: fixedDialogueId },
        {
          $push: {
            messages: [
              {
                sender: 'user',
                message: body.question,
                timestamp: new Date(),
                important: false,
              },
              {
                sender: 'ai',
                message: response.data,
                timestamp: new Date(),
                important: false,
              },
            ],
          },
          $setOnInsert: {
            userId: user._id,
            dialogueId: fixedDialogueId,
            isBranch: false,
            parentDialogueId: null,
          },
          $set: { updatedAt: new Date() },
        },
        { new: true, upsert: true },
      );

      return { data: response.data, dialogueId: fixedDialogueId };
    } catch (error) {
      console.error(
        'Detailed Error:',
        error.response ? error.response.data : error.message,
      );
      throw new InternalServerErrorException('Model communication failed.');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/dialogues')
  async getUserDialogues(@Req() req: RequestWithUser): Promise<any> {
    try {
      const userId = req.user._id;

      const dialogues = await this.dialogueModel.find({ userId: userId });
      const dialogueSummaries = dialogues.map((dialogue) => {
        return {
          dialogueId: dialogue.dialogueId,
          firstMessage: dialogue.messages[0]?.message || 'No messages',
          createdAt: dialogue.createdAt,
        };
      });

      return dialogueSummaries;
    } catch (error) {
      console.error('Error fetching dialogues:', error.message);
      throw new InternalServerErrorException('Failed to fetch dialogues.');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/dialogue/:dialogueId')
  async getDialogueById(@Param('dialogueId') dialogueId: string): Promise<any> {
    try {
      const dialogue = await this.dialogueModel.findOne({ dialogueId });
      if (!dialogue) {
        throw new NotFoundException('Dialogue not found');
      }

      return dialogue;
    } catch (error) {
      console.error('Error fetching dialogue:', error.message);
      throw new InternalServerErrorException('Failed to fetch dialogue.');
    }
  }
}
