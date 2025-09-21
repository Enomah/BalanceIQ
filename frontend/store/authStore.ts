import { create } from "zustand";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { User } from "@/types/userTypes";

interface AuthState {
  accessToken: string | null;
  userProfile: User | null;
  isSignedIn: boolean;
  setAuth: (accessToken: string, userProfile: User) => void;
  updateProfile: () => Promise<void>;
  logout: () => void;
  hydrateFromCookies: () => void;
}

const initializeState = () => {
  const accessToken = getCookie("accessToken");
  const userProfileRaw = getCookie("userProfile");

  let state: Pick<AuthState, "accessToken" | "userProfile" | "isSignedIn"> = {
    accessToken: null,
    userProfile: null,
    isSignedIn: false,
  };

  if (
    typeof accessToken === "string" &&
    typeof userProfileRaw === "string" &&
    userProfileRaw.trim()
  ) {
    try {
      const userProfile: User = JSON.parse(userProfileRaw);

      if (userProfile && typeof userProfile === "object" && userProfile.nickname) {
        state = { accessToken, userProfile, isSignedIn: true };
        // console.log("Initialized from cookies:", {
        //   accessToken: accessToken ? "present" : "missing",
        //   userProfile: userProfile.nickname,
        // });
      } else {
        console.error(
          "Invalid userProfile structure in cookie:",
          userProfileRaw.substring(0, 100) + "..."
        );
        deleteCookie("userProfile");
        deleteCookie("accessToken");
      }
    } catch (error) {}
  } else {
    console.error("no valid accessToken or userProfile");
  }

  return state;
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initializeState(),
  
  setAuth: (accessToken: string, userProfile: User) => {
    set({
      accessToken,
      userProfile,
      isSignedIn: true,
    });

    const cookieOptions = {
      path: "/",
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    //   domain: process.env.NODE_ENV === "production" ? "" : undefined,
    };

    setCookie("accessToken", accessToken, cookieOptions);
    setCookie("userProfile", JSON.stringify(userProfile), cookieOptions);
  },
  updateProfile: async () => {
    // Implement your logic to update the userProfile here
    // Example: fetch new userProfile data and update state
  },
  logout: () => {
    set({
      accessToken: null,
      userProfile: null,
      isSignedIn: false,
    });
    deleteCookie("accessToken");
    deleteCookie("userProfile");
  },
  hydrateFromCookies: () => {
    const accessToken = getCookie("accessToken");
    const userProfileRaw = getCookie("userProfile");
    if (
      typeof accessToken === "string" &&
      typeof userProfileRaw === "string" &&
      userProfileRaw.trim()
    ) {
      try {
        const userProfile: User = JSON.parse(userProfileRaw);
        if (userProfile && typeof userProfile === "object" && userProfile.nickname) {
          set({
            accessToken,
            userProfile,
            isSignedIn: true,
          });
        }
      } catch (error) {
        set({
          accessToken: null,
          userProfile: null,
          isSignedIn: false,
        });
      }
    }
  },
}));
