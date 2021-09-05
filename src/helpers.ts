import User from "./models/user";

export const findUserById = (id: string) => {
   return User.findOneAndUpdate({ id }, {}, { upsert: true, new: true });
};

export const getRandomInt = (max: number) => {
   return Math.floor(Math.random() * (max + 1));
};
