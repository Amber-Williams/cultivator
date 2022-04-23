import { input } from "aws-amplify";
import React, { useEffect, useState, useRef } from "react";

import {
  getUserHabits,
  createUserHabit,
  deleteUserHabit,
  updateUserHabit,
} from "./../../queries/habit";
import styles from "./habit-tracker.module.scss";

const Habit = ({
  name,
  id,
  userId,
  onDeleteHabitSuccess,
  onUpdateHabitSuccess,
}) => {
  const inputRef = useRef();
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = name;
    }
  }, [isEditing]);

  const onDelete = () =>
    deleteUserHabit({ userId, habitId: id })
      .then(() => {
        onDeleteHabitSuccess(id);
      })
      .catch((error) => {
        console.error(error);
        setError("Something went wrong. Habit was not deleted.");
      });

  const onEdit = () => {
    updateUserHabit({ userId, habitId: id, name: inputRef.current.value })
      .then((habit) => {
        setIsEditing(false);
        onUpdateHabitSuccess(habit);
      })
      .catch((error) => {
        console.error(error);
        setError("Something went wrong. Habit could not be edited.");
      });
  };

  const onEditInputChange = () => {
    if (error) {
      setError(false);
    }
  };

  const onEditCancel = () => {
    setIsEditing(false);
    inputRef.current.value = name;
  };

  return (
    <div>
      <div className="d-flex">
        {isEditing ? (
          <>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter habit name"
              className={`${styles.HabitInput} form-control`}
              onChange={onEditInputChange}
            />
            <button className={styles.InputSecondaryButton} onClick={onDelete}>
              Delete
            </button>
            <button
              className={styles.InputSecondaryButton}
              onClick={onEditCancel}
            >
              Cancel
            </button>
            <button className={styles.InputPrimaryButton} onClick={onEdit}>
              Update
            </button>
          </>
        ) : (
          <>
            <div>
              name: {name}, id: {id}
            </div>
            <button onClick={() => setIsEditing(true)}>edit</button>
          </>
        )}
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

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
    if (error) {
      setError(false);
    }
  };

  return (
    <div className="d-flex">
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter habit name"
        className={`${styles.HabitInput} form-control`}
        onChange={onChange}
      />
      <button className={styles.InputPrimaryButton} onClick={onAddHabit}>
        Add
      </button>
      {error && <p>Something went wrong. Unable to add habit.</p>}
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

  const onDeleteHabitSuccess = (habitId) => {
    setHabits(habits.filter((habit) => habit.id !== habitId));
  };

  const onUpdateHabitSuccess = (habit) => {
    const index = habits.findIndex((_habit) => _habit.id === habit.id);
    const newHabits = [...habits];
    newHabits[index] = habit;
    setHabits(newHabits);
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
        <Habit
          userId={userId}
          name={habit.name}
          id={habit.id}
          onDeleteHabitSuccess={onDeleteHabitSuccess}
          onUpdateHabitSuccess={onUpdateHabitSuccess}
        />
      ))}
    </>
  );
};

export default HabitTracker;
