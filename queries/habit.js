const habitUrl = `${process.env.NEXT_PUBLIC_TIME_TRACKER_SERVICE}/habit`;

export const getUserHabits = async ({ userId }) =>
  fetch(`${habitUrl}/${userId}`).then((response) => response.json());

export const createUserHabit = async ({ userId, name }) =>
  fetch(habitUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ user_id: userId, name }),
  }).then((response) => response.json());

export const updateUserHabit = async ({ userId, name }) =>
  fetch(habitUrl, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ user_id: userId, name }),
  }).then((response) => response.json());

export const deleteUserHabit = async ({ userId, habitId }) =>
  fetch(habitUrl, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ user_id: userId, habit_id: habitId }),
  });
