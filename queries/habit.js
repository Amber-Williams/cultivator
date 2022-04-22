const getHabitUrl = (userId) =>
  `${process.env.NEXT_PUBLIC_TIME_TRACKER_SERVICE}/habit/${userId}`;

export const getUserHabits = async ({ userId }) =>
  fetch(getHabitUrl(userId))
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });

export const createUserHabit = async ({ userId, name }) =>
  fetch(getHabitUrl(userId), {
    method: "POST",
    body: JSON.stringify({ userId, name }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });

export const updateUserHabit = async ({ userId, name }) =>
  fetch(getHabitUrl(userId), {
    method: "PUT",
    body: JSON.stringify({ userId, name }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });

export const deleteUserHabit = async ({ userId, name }) =>
  fetch(getHabitUrl(userId), {
    method: "PUT",
    body: JSON.stringify({ userId, name }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
