import Discord from "discord.js";
import { DateTime } from "luxon";
import humanizeDuration from "humanize-duration";

import { DAILY_POINTS, DEFAULT_EMBED_STYLING } from "../constants";
import User from "../models/user";

const dailyPointsHandler = async (message: Discord.Message) => {
   const user = await User.findOneAndUpdate(
      { id: message.author.id },
      {},
      { upsert: true, new: true }
   );

   const yesterday = DateTime.now().minus({ days: 1 });

   if (!user.gotDailyPointsAt || user.gotDailyPointsAt < yesterday.toJSDate()) {
      user.points = (+user.points + DAILY_POINTS).toString();
      user.gotDailyPointsAt = DateTime.now().toJSDate();
      await user.save();
      message.channel.send({
         embeds: [
            {
               ...DEFAULT_EMBED_STYLING,
               description: `**You claimed you ${DAILY_POINTS} Kitty Point,\nCome back tomorrow for more**`,
            },
         ],
      });
   } else {
      const timeToWait = DateTime.fromJSDate(user.gotDailyPointsAt)
         .plus({ days: 1 })
         .diffNow();
      message.channel.send({
         embeds: [
            {
               ...DEFAULT_EMBED_STYLING,
               description: `**Don't be a greedy Kitty! Please wait
                  ${humanizeDuration(timeToWait.valueOf(), {
                     round: true,
                     units: ["d", "h", "m"],
                  })}**`,
            },
         ],
      });
   }
};

export default dailyPointsHandler;
