import Discord from "discord.js";
import { DEFAULT_EMBED_STYLING, GUILD_ID, UPDATES_CHANNEL } from "../constants";
import { getUpdatesChannel } from "../helpers";
import User from "../models/user";

const sendDailyUpdate = async (client: Discord.Client<boolean>) => {
   const channel = await getUpdatesChannel(client);

   if (!channel) return;

   const users = await User.find({});

   const topUsers = users
      .sort((f, s) => +f.points - +s.points)
      .reverse()
      .filter((_, i) => i < 3);

   channel.send({
      embeds: [
         {
            ...DEFAULT_EMBED_STYLING,
            description: `**Today's top Kittens:**`,
            fields: topUsers.map((u, i) => ({
               name: `#${i + 1}: ${u.points} Kitty points`,
               value: `<@${u.id}>, Congrats...`,
            })),
         },
      ],
   });
};

export default sendDailyUpdate;
