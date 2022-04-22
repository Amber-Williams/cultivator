import React, { useEffect, useState, useRef } from "react";

import { getUserHabits, createUserHabit } from "./../../queries/habit";
import styles from "./habit-tracker.module.scss";

const Habit = ({ name, id }) => (
  <div>
    name: {name}, id: {id}
  </div>
);

const AddHabit = ({ userId, onAddHabitSuccess }) => {
  const [error, setError] = useState(false);
  const inputRef = useRef();

  const onAddHabit = () => {
    const name = inputRef.current.value;
    createUserHabit({ userId, name })
      .then((habit) => {
        inputRef.current.value = "";
        onAddHabitSuccess(habit);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      });
  };

  const onChange = () => {
    setError(false);
  };

  return (
    <div className={styles.AddHabit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter habit name"
        className={`${styles.AddHabitInput} form-control`}
        onChange={onChange}
      />
      <button className={styles.AddHabitSubmitButton} onClick={onAddHabit}>
        Add
      </button>
      {error && <p>Something went wrong</p>}
    </div>
  );
};

const HabitTracker = ({ userId }) => {
  const [habits, setHabits] = useState();

  useEffect(() => {
    const func = async () => {
      const habits = await getUserHabits({ userId });
      setHabits(habits);
    };
    func();
  }, [userId]);

  const onAddHabitSuccess = (habit) => {
    setHabits([...habits, habit]);
  };

  if (habits === undefined) {
    return (
      <>
        <h1>Habit Tracker</h1>
        <div>loading</div>
      </>
    );
  }

  return (
    <>
      <h1>Habit Tracker</h1>
      <AddHabit userId={userId} onAddHabitSuccess={onAddHabitSuccess} />
      {habits.map((habit) => (
        <Habit name={habit.name} id={habit.id} />
      ))}
    </>
  );
};

export default HabitTracker;
