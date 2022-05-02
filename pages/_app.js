import Amplify from "aws-amplify";
import { Provider } from "react-redux";

import store from "./../features/store";
import authConfig from "./../features/auth";
import "./../styles/global.scss";

Amplify.configure(authConfig);

const MyApp = ({ Component, pageProps }) => (
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
);

export default MyApp;
