import { Message } from "discord.js";
import { DEFAULT_EMBED_STYLING } from "../constants";
import { findUserById } from "../helpers";

const showProfileHandler = async (message: Message) => {
   const user = await findUserById(message.author.id);

   message.channel.send({
      embeds: [
         {
            ...DEFAULT_EMBED_STYLING,
            description: `**You have ${user.points} Kitty Points**`,
         },
      ],
   });
};

export default showProfileHandler;
