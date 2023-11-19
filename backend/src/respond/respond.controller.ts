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
  Delete,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Types } from 'mongoose';

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
    @Body() body: { question: string; dialogueId: string },
    @Req() req: RequestWithUser,
  ): Promise<any> {
    try {
      const user = req.user;
      console.log('User:', user);

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

      let dialogue;
      if (body.dialogueId) {
        const objectId = new Types.ObjectId(body.dialogueId);
        dialogue = await this.dialogueModel.findById(objectId);
        if (!dialogue) {
          throw new NotFoundException('Dialogue not found');
        }

        dialogue.messages.push(
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
        );
        dialogue.updatedAt = new Date();
        await dialogue.save();
      } else {
        // Create new dialogue
        dialogue = await this.dialogueModel.create({
          userId: user._id,
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
          isBranch: false,
          parentDialogueId: null,
          updatedAt: new Date(),
        });
      }

      return { data: response.data, dialogueId: dialogue._id.toString() };
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
          dialogueId: dialogue._id.toString(), // Use the native _id property
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
      const objectId = new Types.ObjectId(dialogueId);
      const dialogue = await this.dialogueModel.findOne({ _id: objectId });
      if (!dialogue) {
        throw new NotFoundException('Dialogue not found');
      }

      return dialogue;
    } catch (error) {
      console.error('Error fetching dialogue:', error.message);
      throw new InternalServerErrorException('Failed to fetch dialogue.');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthGuard('jwt'))
  @Delete('/dialogue/:dialogueId')
  async deleteDialogue(
    @Param('dialogueId') dialogueId: string,
    @Req() req: RequestWithUser,
  ): Promise<any> {
    try {
      const userId = req.user._id;
      const objectId = new Types.ObjectId(dialogueId);

      const result = await this.dialogueModel.deleteOne({
        _id: objectId,
        userId: userId,
      });
      if (result.deletedCount === 0) {
        throw new NotFoundException(
          'Dialogue not found or user not authorized to delete this dialogue',
        );
      }

      return { message: 'Dialogue deleted successfully' };
    } catch (error) {
      console.error('Error deleting dialogue:', error.message);
      throw new InternalServerErrorException('Failed to delete dialogue.');
    }
  }
}
