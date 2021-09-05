import Discord from "discord.js";
import { DEFAULT_EMBED_STYLING, GUILD_ID, UPDATES_CHANNEL } from "../constants";
import User from "../models/user";

const sendDailyUpdate = async (client: Discord.Client<boolean>) => {
   const guilds = await client.guilds.fetch();
   const guild = await guilds
      .filter((g) => g.id === GUILD_ID)
      .first()
      ?.fetch();

   if (!guild) return;

   const channels = await guild.channels.fetch();
   const channel = (await channels
      .filter(
         (c) =>
            c.id === UPDATES_CHANNEL && c.isText() && c.type === "GUILD_TEXT"
      )
      .first()
      ?.fetch()) as Discord.TextChannel | undefined;

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
