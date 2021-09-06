import User from "./models/user";
import Discord from "discord.js";
import { GUILD_ID, UPDATES_CHANNEL } from "./constants";

export const findUserById = (id: string) => {
   return User.findOneAndUpdate({ id }, {}, { upsert: true, new: true });
};

export const getRandomInt = (max: number) => {
   return Math.floor(Math.random() * (max + 1));
};

export const getUpdatesChannel = async (client: Discord.Client<true>) => {
   const guilds = await client.guilds.fetch();
   const guild = await guilds
      .filter((g) => g.id === GUILD_ID)
      .first()
      ?.fetch();

   if (!guild) return false;

   const channels = await guild.channels.fetch();
   const channel = (await channels
      .filter(
         (c) =>
            c.id === UPDATES_CHANNEL && c.isText() && c.type === "GUILD_TEXT"
      )
      .first()
      ?.fetch()) as Discord.TextChannel | undefined;

   if (!channel) return false;
   return channel;
};
