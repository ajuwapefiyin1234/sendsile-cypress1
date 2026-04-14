import { ROUTE } from "@/routes";
import setAuthToken from "./setAuthToken";
import api from "@/utils/api";
import { toast } from "sonner";
import { useStore } from "@/store/store";
// import { accessTTL } from "./reusable";

export const logOutAction = async (isUnauth) => {
  const user = getWithExpiry('vendor-storage');
  // Get tokens from storage
  const token = user?.token;
  if (token && !isUnauth) {
    try {
      // Handle any logout logic if needed
      await api.post('auth/logout');
      toast.success('Logged out successfully');
    } catch (error) {
        toast.success(`Logged out ${error?.message || ''}`);
      //   toast.error("Logout error");
      // console.error("Logout error:", error);
    }
  }
  localStorage.clear();

  // Update Zustand store using setState
  useStore.setState((state) => ({
    auth: {
      ...state.auth,
      user: null,
    },
  }));
  setAuthToken(false);
  // Delay the redirect to allow the toast to be visible
  setTimeout(() => {
    window.location.href = ROUTE.login;
  }, 1500);
};

export function getWithExpiry(key) {
  if (typeof window !== "undefined") {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    return item?.state?.auth?.user;
  }
}

export function setWithExpiry(key, value, ttl) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export async function refreshToken() {
  try {
    throw new Error();
    // Uncomment the following code when the refresh token endpoint is available
    // const tokens = getWithExpiry("tokens");
    // const refreshToken = tokens?.refresh_token;
    // if (!refreshToken) {
    //  return null
    //   throw new Error("No refresh token available");
    // }
    // const { data } = await api.post("/refresh/token", {
    //   refresh_token: refreshToken,
    // });
    // if (!data.status) {
    //   throw new Error("Refresh status failed");
    // }
    // const newAccessToken = data.data.access_token;
    // const newRefreshToken = data.data.refresh_token;
    // setWithExpiry(
    //   "tokens",
    //   { token: newAccessToken, refresh_token: newRefreshToken },
    //   accessTTL
    // );
    // return newAccessToken;
  } catch (error) {
    //  console.error("Error refreshing token:", error?.response?.data?.message);
 if (error) {
   return null;
 }
  }
}

export function replaceSpace(title) {
  return title.replace(/\s+/g, '-').toLowerCase();
}
