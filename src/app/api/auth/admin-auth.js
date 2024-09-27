import { useMutation } from "react-query";
import config from "../../auth/services/jwt/jwtAuthConfig";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Cookie from "js-cookie";
// import {
//   adminSignIn,
//   resetshopPasswordWithcode,
//   shopForgotPasswordInit,
//   // adminClientLogin, adminSignIn,
//   //  logOutAdmin,
// } from '../client/clientToApiRoutes';
// import {
//   remove_SHOP_FORGOTPASS_TOKEN,
//   setAuthCredentials,
//   setAuthTokens,
//   setShopForgotPasswordPAYLOAD,
// } from '../../utils/authUtils';
import { toast } from "react-toastify";
import { adminSigin } from "../apiRoutes";

export function useAdminLogin() {
  // const navigate = useNavigate();
  return useMutation(adminSigin, {
    onSuccess: (data) => {
      // console.log("userFromAuthentication", data?.data);
      // console.log("tokenFromAuthentication", data?.data?.accessToken);

      //  return
      if (data?.data && data?.data?.accessToken) {
        /**============================================================================== */

        const transFormedUser = {
          id: data?.data?._id,
          name: data?.data?.name,
          email: data?.data?.email,
          role: "admin",

          isAdmin: data?.data?.isAdmin,
          avatar: data?.data?.avatar,
        };

        // setSession(accessToken);
        if (data?.data?.accessToken) {
          localStorage.setItem(config.tokenStorageKey, data?.data?.accessToken);
          // axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          axios.defaults.headers.common.accessToken = `${data?.data?.accessToken}`;
        }

        // setIsAuthenticated(setIsAthenticatedStorage(accessToken));
        if (isTokenValid(data?.data?.accessToken)) {
          localStorage.setItem(config.isAuthenticatedStatus, true);
        } else {
          localStorage.setItem(config.isAuthenticatedStatus, false);
        }

        if(transFormedUser){
          setUserCredentialsStorage(transFormedUser);
          window.location.reload();
        }

       

        // return;
      } else if (data) {
        console.log("LoginError22_", data.data);

        Array.isArray(data?.data?.message)
          ? data?.data?.message?.map((m) => toast.error(m.message))
          : toast.error(data?.data?.message);
        return;
      } else {
        toast.info("something unexpected happened");
        return;
      }
    },
    onError: (error) => {
      console.log("LoginError22Block", error);

      const {
        response: { data },
      } = error ?? {};
      Array.isArray(data?.message)
        ? data?.message?.map((m) => toast.error(m))
        : toast.error(data?.message);
    },
  });
}

const isTokenValid = (accessToken) => {
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      // console.log("DECODED Token-DATA", decoded)
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  return false;
};

const setUserCredentialsStorage = (userCredentials) => {
  console.log("UserCredentials TO-SET", userCredentials);
  // localStorage.setItem(config.adminCredentials, JSON.stringify({ userCredentials }))
  Cookie.set(config.adminCredentials, JSON.stringify({ userCredentials }));
};
