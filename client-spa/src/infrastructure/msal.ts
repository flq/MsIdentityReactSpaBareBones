import {
  PublicClientApplication,
  AuthenticationResult,
  AccountInfo,
} from "@azure/msal-browser";
import { useCallback, useEffect, useState } from "react";

type Profile = {
  username: string;
} & (
  | {
      isAuthenticated: false;
    }
  | {
      isAuthenticated: true;
      account: AccountInfo;
      accessToken: string;
    }
);

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID as string,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:3000",
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

const apiScope = {
  resourceUri: "https://localhost:5001/api/profile",
  resourceScope: process.env.REACT_APP_RESOURCE_SCOPE as string,
};

/**
 * Scopes you enter here will be consented once you authenticate. For a full list of available authentication parameters,
 * visit https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const loginRequest = {
  scopes: ["openid", "profile", "offline_access"],
};

// Add here scopes for access token to be used at the API endpoints.
export const tokenRequest = {
  scopes: [apiScope.resourceScope],
};

// Add here scopes for silent token request
export const silentRequest = {
  scopes: ["openid", "profile", apiScope.resourceScope],
};

const msalApp = new PublicClientApplication(msalConfig);

export function useMsal() {
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<Profile>({
    isAuthenticated: false,
    username: "",
  });

  const getAccounts = async () => {
    const currentAccounts = msalApp.getAllAccounts();

    if (currentAccounts === null) {
      setError(new Error("No accounts detected!"));
      return;
    } else {
      if (currentAccounts.length > 1) {
        console.warn("Multiple accounts detected.");
        // Add choose account code here
      }
      if (currentAccounts.length > 0) {
        const account = msalApp.getAccountByUsername(
          currentAccounts[0].username
        )!;
        const result = await acquireToken(account);
        if (result) {
          setProfile({
            username: currentAccounts[0].username,
            account,
            isAuthenticated: true,
            accessToken: result!.accessToken,
          });
        }
      }
    }
  };

  const handleResponse = async (response: AuthenticationResult | null) => {
    if (response !== null) {
      setError(null);
      setProfile({
        account: response.account,
        username: response.account.username,
        accessToken: "",
        isAuthenticated: true,
      });
    } else {
      await getAccounts();
    }
  };

  const signIn = useCallback(async () => {
    try {
      const response = await msalApp.loginPopup(loginRequest);
      await handleResponse(response);
      const authResult = await acquireToken(response.account);
      setProfile((profile) => ({
        ...profile,
        accessToken: authResult!.accessToken,
      }));
    } catch (error) {
      setError(error);
    }
  }, []);

  const signOut = useCallback(async () => {
    await msalApp.logout({
      account: msalApp.getAccountByUsername(profile!.username)!,
    });
  }, [profile]);

  const acquireToken = useCallback(async (account: AccountInfo) => {
    /**
     * See here for more info on account retrieval:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    const request = { ...silentRequest, account };

    try {
      return await msalApp.acquireTokenSilent(request);
    } catch {
      try {
        return await msalApp.acquireTokenPopup(tokenRequest);
      } catch (error) {
        setError(error);
      }
    }
  }, []);

  useEffect(() => {
    getAccounts().catch((error) => setError(error));
  }, []);

  return { profile, error, signIn, signOut, acquireToken };
}
