import React, { useEffect, useState } from "react";

import { getUserHabits } from "./../../queries/habit";

const Habit = ({ name, id }) => (
  <div>
    name: {name}, id: {id}
  </div>
);

const HabitTracker = ({ userId }) => {
  const [habits, setHabits] = useState();

  useEffect(() => {
    const func = async () => {
      const habits = await getUserHabits({ userId });
      setHabits(habits);
    };
    func();
  }, [userId]);

  if (!habits) {
    return <div>loading</div>;
  }

  return habits.map((habit) => <Habit name={habit.name} id={habit.id} />);
};

export default HabitTracker;
