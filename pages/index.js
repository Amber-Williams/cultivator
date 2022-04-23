import Head from "next/head";
import { useState, useEffect } from "react";
import Amplify, { API, Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";

import config from "./../aws-exports";
import TimeTracker from "./../components/time-tracker/time-tracker";
import HabitTracker from "./../components/habit-tracker";
import SignOutButton from "./../components/admin/sign-out-button";
import TimeEntryChart from "./../components/time-entry-chart/time-entry-chart";

Amplify.configure(config);

const IndexPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((userObj) => {
        API.get("api", "/login")
          .then((data) => {
            if (data.success) {
              const _user = {
                username: userObj.username,
                id: userObj.attributes.sub,
              };
              setUser(_user);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err)); //TODO: error state
  }, []);

  return user ? (
    <div className="App">
      <Head>
        <title>Cultivator</title>
        <meta name="description" content="An app to track shit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SignOutButton />
      <div className="text-light">Hello, {user.username}</div>

      <TimeTracker API={API} />
      <TimeEntryChart />
      <div className="my-5">
        <HabitTracker userId={user.id} />
      </div>
    </div>
  ) : (
    <div className="spinner-border text-dark" role="status"></div>
  );
};

export default withAuthenticator(IndexPage);
