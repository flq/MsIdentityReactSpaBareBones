import React, { useCallback, useState } from "react";
import { getProfileData, ProfileData } from "infrastructure/api";
import styles from "./ProfileDataView.module.css";

export function ProfileDataView() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfileData = useCallback(async () => {
    try {
      setError(null);
      const data = await getProfileData();
      setProfileData(data);
    } catch (error) {
      setError(error);
    }
  }, []);

  return (
    <article className={styles.article}>
      <button className={styles.loadButton} onClick={fetchProfileData}>Load Profile data</button>
      {error && <span className={styles.error}>{error.message}</span>}
      {profileData && <ProfileDataGrid profileData={profileData} />}
    </article>
  );
}

function ProfileDataGrid({
  profileData: {
    id,
    userPrincipalName,
    givenName,
    surname,
    jobTitle,
    mobilePhone,
    preferredLanguage,
  },
}: {
  profileData: ProfileData;
}) {
  return (
    <ul className={styles.profileData}>
      <li>
        <label>Id</label>
        <span>{id}</span>
      </li>
      <li>
        <label>User principal name</label>
        <span>{userPrincipalName}</span>
      </li>
      <li>
        <label>Given Name</label>
        <span>{givenName}</span>
      </li>
      <li>
        <label>Surname</label>
        <span>{surname}</span>
      </li>
      <li>
        <label>Job Title</label>
        <span>{jobTitle}</span>
      </li>
      <li>
        <label>Mobile Phone</label>
        <span>{mobilePhone}</span>
      </li>
      <li>
        <label>Preferred Language</label>
        <span>{preferredLanguage}</span>
      </li>
    </ul>
  );
}
