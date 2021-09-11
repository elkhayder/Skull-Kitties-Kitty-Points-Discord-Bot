import Discord, { Intents } from "discord.js";
import mongoose from "mongoose";
import cron from "node-cron";
require("dotenv").config();

import {
   ALLOWED_CHANNELS,
   COMMAND_PREFIX,
   DEFAULT_EMBED_STYLING,
   GUILD_ID,
} from "./constants";
import addPointsOnMessage from "./handlers/addPointsOnMessage";
import sendDailyUpdate from "./handlers/sendDailyUpdate";
import { commandHandler } from "./handlers/_index";
import { getUpdatesChannel } from "./helpers";

const client = new Discord.Client({
   intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_INVITES,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
   ],
});

// Connect to mongoose
mongoose.connect(
   `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_URI}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
);

client.on("messageCreate", (message) => {
   if (message.guildId !== GUILD_ID || message.author.bot) return;

   if (message.content.startsWith(COMMAND_PREFIX)) {
      commandHandler(message);
   } else {
      addPointsOnMessage(message);
   }
});

client.once("ready", async (c) => {
   console.log("Ready");

   client.user?.setPresence({
      activities: [{ type: "LISTENING", name: "your messages" }],
   });

   cron.schedule(
      "0 0 21 * *",
      () => {
         sendDailyUpdate(c);
      },
      { timezone: "Africa/Casablanca", scheduled: true }
   );

   // const channel = await getUpdatesChannel(client);

   // if (channel) {
   //    channel.send({
   //       embeds: [
   //          {
   //             ...DEFAULT_EMBED_STYLING,
   //             description: `**I'm here kitties, Purrr!\nWe can chat in <#${ALLOWED_CHANNELS[0]}>**`,
   //          },
   //       ],
   //    });
   // }
});

client.login(process.env.DISCORD_TOKEN);
