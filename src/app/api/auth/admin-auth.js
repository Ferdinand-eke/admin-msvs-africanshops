import { useMutation } from "react-query";
import config from "../../auth/services/jwt/jwtAuthConfig";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import { adminSigin } from "../apiRoutes";

export function useAdminLogin() {
  return useMutation(adminSigin, {
    onSuccess: (data) => {
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

        // if (data?.data?.accessToken) {
        //   localStorage.setItem(config.tokenStorageKey, data?.data?.accessToken);
        //   // axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        //   axios.defaults.headers.common.accessToken = `${data?.data?.accessToken}`;
        // }

        if (isTokenValid(data?.data?.accessToken)) {

          console.log("TOKEN__CHECK___2", data?.data?.accessToken);
          localStorage.setItem(config.isAuthenticatedStatus, true);
         
        } else {
          localStorage.setItem(config.isAuthenticatedStatus, false);
          toast.error("login failed, token not authorized")
          return;
        }

         /***Set token to headers starts */
         let isSetAuthorizers = false
         localStorage.setItem(config.tokenStorageKey, data?.data?.accessToken);
          axios.defaults.headers.common.accessToken = `${data?.data?.accessToken}`;
          isSetAuthorizers = true;
          /***Set token to headers ends */

        if (isSetAuthorizers && transFormedUser) {
          setUserCredentialsStorage(transFormedUser);
        }
      } else if (data) {
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
  // console.log("TOKEN__VALIDATION__1", accessToken);

  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      // console.log("DECODED Token-DATA", decoded)
      // console.log('DATE_NOW', Date.now())
      const currentTime = Date.now() / 1000;
      console.log("EXP__2", decoded.exp);

      console.log("CURR__3", currentTime);
      console.log("IS__HIGHER", Boolean(decoded.exp > currentTime));
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  // setTimeout(() => {
   

  //   return false;
  // }, "2000");
};

// const setUserCredentialsStorage = (userCredentials) => {
//   Cookie.set(config.adminCredentials, JSON.stringify({ userCredentials }));
// };
 // localStorage.setItem(config.authStatus, "authenticated");//jwt_is_authStatus

const setUserCredentialsStorage = (userCredentials) => {
  const setUserCookie = Cookie.set(
    config.adminCredentials,
    JSON.stringify({ userCredentials })
  );

  if (setUserCookie) {
    window.location.reload();
  }
};
