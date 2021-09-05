import { Message } from "discord.js";
import { MEMES_CHANNEL } from "../constants";
import { findUserById } from "../helpers";

const addPointsOnMessage = async (message: Message) => {
   const user = await findUserById(message.author.id);

   let isMeme = false;

   if (
      message.channelId === MEMES_CHANNEL &&
      message.attachments.some((a) => !!a.width && !!a.height)
   ) {
      isMeme = true;
   }

   user.points = (+user.points + (isMeme ? 2 : 1)).toString();
   user.save();
};

export default addPointsOnMessage;
