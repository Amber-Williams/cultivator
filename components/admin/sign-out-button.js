import React from "react";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import styles from "./admin.module.scss";

const SignOutButton = () => (
  <div className={styles.SignOutButton}>
    <AmplifySignOut />
  </div>
);

export default SignOutButton;
