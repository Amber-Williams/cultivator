import React from "react";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import "./admin.module.scss";

const SignOutButton = () => (
  <div className="SignOutButton">
    <AmplifySignOut />
  </div>
);

export default SignOutButton;
