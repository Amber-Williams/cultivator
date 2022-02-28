import React from "react";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import "./admin.scss";

const SignOutButton = () => (
  <div className="SignOutButton">
    <AmplifySignOut />
  </div>
);

export default SignOutButton;
