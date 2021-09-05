import { Message } from "discord.js";
import { DEFAULT_EMBED_STYLING } from "../constants";
import { HandlerType } from "../types";
import addPointsOnMessage from "./addPointsOnMessage";
import dailyPointsHandler from "./dailyPointsHandler";
import scratchPointsHandler from "./scratchPointsHandler";
import showProfileHandler from "./showProfileHandler";

const commands: HandlerType[] = [
   {
      command: "points",
      handler: dailyPointsHandler,
   },
   {
      command: "scratch",
      handler: scratchPointsHandler,
   },
   {
      command: "profile",
      handler: showProfileHandler,
   },
];

export const commandHandler = (message: Message) => {
   const askedCommand = message.content.split(" ")[0].substring(1);
   const filteredCommands = commands.filter((c) => c.command === askedCommand);

   if (filteredCommands.length === 0) {
      message.channel.send({
         embeds: [
            {
               ...DEFAULT_EMBED_STYLING,
               description: `**I haven't learned this trick yet, Kitty!**`,
            },
         ],
      });
      return;
   }

   filteredCommands[0].handler(message);
};
