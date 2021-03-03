import React, { useState, useEffect } from "react"
import { Auth } from 'aws-amplify'

const username = "test"
const password = "test1234"
const email = "test1234@gmail.com"
const phone_number = "+441231231234"

async function signUp() {
    try {
        const { user } = await Auth.signUp({
            username,
            password,
            attributes: {
                email,          // optional
                phone_number,   // optional - E.164 number convention
                // other custom attributes 
            }
        });
        console.log(user);
    } catch (error) {
        console.log('error signing up:', error);
    }
  }
  
  async function confirmSignUp() {
    try {
      await Auth.confirmSignUp(username, code);
    } catch (error) {
        console.log('error confirming sign up', error);
    }
  }
  
  async function resendConfirmationCode() {
    try {
        // await Auth.resendSignUp(username);
        await Auth.resendSignUp(username);
        console.log('code resent successfully');
    } catch (err) {
        console.log('error resending code: ', err);
    }
  }
  
  async function signIn() {
    try {
        const user = await Auth.signIn(username, password);
    } catch (error) {
        console.log('error signing in', error);
    }
  }
  
  async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }

const Authenticator = () => {
    // TODO: create custom authenication flow that doesn't require phone number
    const [user, setUser] = useState();
    const [token, setToken] = useState();
  
    useEffect(async () => {
      await signIn()
      setUser(Auth.user)
  
      Auth.currentSession().then(res=>{
        const accessToken = res.getAccessToken()
        const jwt = accessToken.getJwtToken()
        setToken(jwt)
      })
      // signUp()
      // confirmSignUp()
      // resendConfirmationCode()
      
    }, []);
}

export default Authenticator