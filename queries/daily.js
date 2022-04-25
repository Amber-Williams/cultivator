import moment from "moment";

const dailyUrl = `${process.env.NEXT_PUBLIC_TIME_TRACKER_SERVICE}/daily`;

export const getUserDateHabits = async ({ userId, date }) => {
  const formattedDate = moment(date).format("YYYY-MM-DD");
  return fetch(
    `${dailyUrl}/${userId}?start=${formattedDate}&end=${formattedDate}`
  ).then((response) => response.json());
};

export const addDailyDateHabit = async ({ dailyId, userId, date, habits }) => {
  if (!dailyId) {
    const formattedDate = moment(date).format("YYYY-MM-DD");

    return fetch(`${dailyUrl}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, date: formattedDate, habits }),
    }).then((response) => response.json());
  } else {
    return fetch(`${dailyUrl}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, daily_id: dailyId, habits }),
    }).then((response) => response.json());
  }
};
