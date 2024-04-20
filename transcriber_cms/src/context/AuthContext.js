import { createContext, useEffect, useReducer, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "../firebase";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  function logOut() {
    return signOut(auth);
  }
  /*function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }*/

  function setUpRecaptha(number) {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {}
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }

    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      //console.log(currentuser.accessToken);
      setUser(currentuser);
      localStorage.setItem("user", JSON.stringify(currentuser));
      // update the auth context
      dispatch({ type: "LOGIN", payload: currentuser });
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,

        logOut,
        ...state,
        dispatch,
        isLoading,
        setUpRecaptha,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
