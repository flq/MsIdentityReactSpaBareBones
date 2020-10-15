import React, { useEffect, useState } from "react";
import style from "./App.module.css";
import * as api from "infrastructure/api";
import { useMsal } from "infrastructure/msal";
import { ProfileDataView } from "./ProfileDataView";

function App() {
  const [env, setEnv] = useState("...");
  const [notificationPermission, setNotificationPermission] = useState("default");
  const { profile, signIn, signOut, error } = useMsal();
  useEffect(() => void api.getEnv().then((env) => setEnv(env)), []);
  useEffect(() => {
    if (profile.isAuthenticated) {
      api.setBearerToken(profile.accessToken);
    }
  }, [profile]);
  
  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setNotificationPermission(result);
  }

  return (
    <main>
      <header className={style.header}>
        <h1>Sign-In POC. Current environment: {env}</h1>
        <div className={style.profile}>
          {profile.isAuthenticated ? (
            <>
              <span>{profile.username}</span>
              <button onClick={signOut}>Sign Out</button>
            </>
          ) : (
            <button onClick={signIn}>Sign In</button>
          )}
          {error && <span>{error.message}</span>}
        </div>
      </header>
      <button onClick={requestPermission}>Request Permission for notifications</button>
      <p>{notificationPermission}</p>
      {profile.isAuthenticated && <ProfileDataView />}
    </main>
  );
}

export default App;
