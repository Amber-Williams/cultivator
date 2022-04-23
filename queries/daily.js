import moment from "moment";

const dailyUrl = `${process.env.NEXT_PUBLIC_TIME_TRACKER_SERVICE}/daily`;

export const getUserDateHabits = async ({ userId, date }) => {
  const formattedDate = moment(date).format("YYYY-MM-DD");
  return fetch(
    `${dailyUrl}/${userId}?start=${formattedDate}&end=${formattedDate}`
  ).then((response) => response.json());
};
