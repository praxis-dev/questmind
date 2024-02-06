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
  Res,
  Query,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Types } from 'mongoose';

import { Dialogue } from './entities/dialogue.entity';
import { User } from '../users/entities/user.entity';

import { WsGateway } from '../websockets/ws.gateway';

import { Response } from 'express';
import { Observable } from 'rxjs';

import { v4 as uuidv4 } from 'uuid'; 

interface RequestWithUser extends Request {
  user: User;
}

@Controller('respond')
export class RespondController {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel('Dialogue') private dialogueModel: Model<Dialogue>,
    private jwtService: JwtService,
    private wsGateway: WsGateway,
  ) {}
  
  @UseGuards(AuthGuard('jwt'))
  @Get('/respond')
  async respond(
    @Query('question') question: string,
    @Query('dialogueId') dialogueId: string,
    @Res() res: Response, 
    @Req() req: RequestWithUser,
  ): Promise<any> {
    try {
      const user = req.user;
      let isNewDialogue = false;

  
      const apiEndpoint = process.env.API_ENDPOINT;
      if (!apiEndpoint) {
        throw new Error('API_ENDPOINT is not defined in the environment');
      }
  
      let dialogue;
      if (dialogueId) {
        const objectId = new Types.ObjectId(dialogueId);
        dialogue = await this.dialogueModel.findById(objectId);
        if (!dialogue) {
          throw new NotFoundException('Dialogue not found');
        }
      } else {
        isNewDialogue = true;

        dialogue = await this.dialogueModel.create({
          userId: user._id,
          messages: [],
          isBranch: false,
          parentDialogueId: null,
          updatedAt: new Date(),
        });
      }
  
      dialogue.messages.push({
        sender: 'user',
        message: question,
        timestamp: new Date(),
        important: false,
      });
  
      const combinedInput = dialogue.messages.map(msg => `${msg.sender}: ${msg.message}`).join('\n');
  
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      const response: Observable<any> = this.httpService.post(apiEndpoint, { query: combinedInput }, { responseType: 'stream' });
      response.subscribe({
        next: (response) => {
          const stream = response.data;
          let messageBuffer = '';
  
          stream.on('data', (chunk) => {
            const chunkAsString = chunk.toString();
            if (chunkAsString.startsWith('data: ')) {
              const jsonPart = chunkAsString.substring(6).trim();
              if (jsonPart) {
                const match = jsonPart.match(/{.*?}/);
                if (match) {
                  const validJsonPart = match[0];
                  try {
                    const parsedChunk = JSON.parse(validJsonPart);
                    if (parsedChunk && parsedChunk.data) {
                      const messageContent = parsedChunk.data;
                      messageBuffer += messageContent; 
  
                      res.write(`data: ${messageContent}\n\n`);
                    }
                  } catch (error) {
                    console.error('Error parsing chunk: ', error, 'Chunk:', validJsonPart);
                  }
                }
              }
            }
          });
  
          stream.on('end', async () => {

            if (isNewDialogue) {
              res.write(`data: id: ${dialogue._id}\n\n`); 
            }
  
            if (messageBuffer.trim() !== '') {
              dialogue.messages.push({
                sender: 'ai',
                message: messageBuffer,
                timestamp: new Date(),
                important: false,
              });
              await dialogue.save();
            }
            res.end(); 
          });
        },
        error: (err) => {
          console.error('Error in response:', err);
          res.status(500).send('Stream error');
        },
      });
    } catch (error) {
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
          dialogueId: dialogue._id.toString(),
          firstMessage: dialogue.messages[0]?.message || 'No messages',
          createdAt: dialogue.createdAt,
          updatedAt: dialogue.updatedAt,
        };
      });

      return dialogueSummaries;
    } catch (error) {
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
      throw new InternalServerErrorException('Failed to delete dialogue.');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/dialogue/:dialogueId/share')
  async shareDialogue(
    @Param('dialogueId') dialogueId: string,
    @Req() req: RequestWithUser,
  ): Promise<any> {
    try {
      const userId = req.user._id;
      const objectId = new Types.ObjectId(dialogueId);
      const dialogue = await this.dialogueModel.findOne({ _id: objectId, userId: userId });
  
      if (!dialogue) {
        throw new NotFoundException('Dialogue not found');
      }
  
      // Check if the dialogue is already shared, if not, generate link and update
      if (!dialogue.isShared) {
        dialogue.isShared = true;
  
        // Generate a unique, secure identifier for the shareable link
        const shareIdentifier = uuidv4();
  
        // Store the identifier in the dialogue document
        // You might need to add a new field in your dialogue schema for this identifier
        dialogue.shareIdentifier = shareIdentifier;
  
        // Construct the shareable link using the secure identifier
        dialogue.dialogueLink = `https://questmind.ai/shared/${shareIdentifier}`;
  
        await dialogue.save();
        return { message: 'Dialogue shared successfully', link: dialogue.dialogueLink };
      } else {
        return { message: 'Dialogue is already shared', link: dialogue.dialogueLink };
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to share dialogue.');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/dialogue/:dialogueId/unshare')
  async unshareDialogue(
    @Param('dialogueId') dialogueId: string,
    @Req() req: RequestWithUser,
  ): Promise<any> {
    try {
      const userId = req.user._id;
      const objectId = new Types.ObjectId(dialogueId);
      const dialogue = await this.dialogueModel.findOne({ _id: objectId, userId: userId });

      if (!dialogue) {
        throw new NotFoundException('Dialogue not found');
      }

      // If the dialogue is shared, unshare it
      if (dialogue.isShared) {
        dialogue.isShared = false;
        // Optionally clear or deactivate the link
        dialogue.dialogueLink = '';
        await dialogue.save();
        return { message: 'Dialogue unshared successfully' };
      } else {
        return { message: 'Dialogue is not shared' };
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to unshare dialogue.');
    }
  }

}
