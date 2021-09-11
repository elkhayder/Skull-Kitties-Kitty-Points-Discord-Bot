import Discord from "discord.js";
import { DateTime } from "luxon";
import humanizeDuration from "humanize-duration";

import { DEFAULT_EMBED_STYLING } from "../constants";
import { findUserById, getRandomInt } from "../helpers";

const scratchPointsHandler = async (message: Discord.Message) => {
   const mention = message.mentions.members?.first();

   if (!mention) {
      message.channel.send(
         `You haven't mentioned whose back you wanna scratch :stuck_out_tongue:`
      );
      return;
   }

   if (mention.id === message.author.id) {
      message.channel.send({
         embeds: [
            {
               ...DEFAULT_EMBED_STYLING,
               description:
                  "**You can't snatch from yourself Kitty, can you?**",
            },
         ],
      });
      return;
   }

   const user = await findUserById(message.author.id);

   const sixteenHoursAgo = DateTime.now().minus({ hours: 16 });

   if (user.scratchedAt && user.scratchedAt > sixteenHoursAgo.toJSDate()) {
      const timeToWait = DateTime.fromJSDate(user.scratchedAt)
         .plus({ hours: 16 })
         .diffNow();
      message.channel.send({
         embeds: [
            {
               ...DEFAULT_EMBED_STYLING,
               description: `**Don't be a greedy Kitty!**\nPlease wait ${humanizeDuration(
                  timeToWait.valueOf(),
                  {
                     round: true,
                     units: ["d", "h", "m"],
                  }
               )}`,
            },
         ],
      });
      return;
   }

   const mentionnedUser = await findUserById(mention.id);

   const amountScratched = Math.min(+mentionnedUser.points, getRandomInt(15));

   user.points = (+user.points + amountScratched).toString();
   user.scratchedAt = DateTime.now().toJSDate();
   await user.save();

   mentionnedUser.points = (
      +mentionnedUser.points - amountScratched
   ).toString();
   await mentionnedUser.save();

   message.channel.send({
      embeds: [
         {
            ...DEFAULT_EMBED_STYLING,
            description: `**You just snatched ${amountScratched} Kitty Points from <@${mention.id}>**`,
         },
      ],
   });
};

export default scratchPointsHandler;
