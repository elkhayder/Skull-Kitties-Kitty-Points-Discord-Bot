import { Message } from "discord.js";
import { Document } from "mongoose";

export type HandlerType = {
   command: string;
   handler: (message: Message) => void;
};

export type UserType = {
   id: string;
   points: string;
   scratchedAt: Date | null;
   gotDailyPointsAt: Date | null;
} & Document;
