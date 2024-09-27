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
// import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { adminSigin } from "../apiRoutes";
// import { Navigate } from 'react-router-dom';

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
          // window.location.replace('/dashboards/project');
          // <Navigate to="/dashboards/project" />
          // navigate('/')
          window.location.reload();
        }

       

        // return;
      } else if (data) {
        console.log("LoginError22_", data.data);

        // toast.error(data?.data?.message);
        // console.log(Array.isArray(data?.data?.message) ? data?.data?.message?.map((m) => toast.error(m.message)) : toast.error(data?.data?.message))
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

// export function useShopForgotPass() {
//   const navigate = useNavigate();
//   return useMutation(shopForgotPasswordInit, {
//     onSuccess: (data) => {
//       console.log('LoginError11', data);
//       console.log('LoginError22', data?.data);
//       console.log('LoginError33', data?.data?.data);
//       if (data?.data?.forgotpass_activation_token && data?.data?.message) {
//         // ?.data
//         // setShopForgotPasswordPAYLOAD
//         setShopForgotPasswordPAYLOAD(data?.data?.forgotpass_activation_token);
//         // toast.success('logged in successfully')
//         toast.success(data?.data?.message);

//         // history('/resetShopPassword');
//         navigate('/resetShopPassword');
//         // window.location.replace('/rese')infomessage

//         return;
//       } else if (data?.data?.infomessage) {
//         console.log('LoginError22', data);

//         toast.error(data?.data?.infomessage);
//         return;
//       } else {
//         toast.info('something unexpected happened');
//         return;
//       }
//     },
//     onError: (error) => {
//       console.log('LoginError22', error);
//       const {
//         response: { data },
//       } = error ?? {};
//       // data?.message?.map((m: []) => toast.error(m))
//       Array.isArray(data?.message) ? data?.message?.map((m) => toast.error(m)) : toast.error(data?.message);
//     },
//   });
// }

// export function useResetShopPass() {
//   const history = useNavigate();
//   return useMutation(resetshopPasswordWithcode, {
//     onSuccess: (data) => {
//       if (data?.data?.message & data?.data?.user) {
//         console.log('LoginError11____________', data);
//         toast.success(data?.data?.message);

//         return;
//       }else if (data?.data?.message) {
//         Array.isArray(data?.data?.message) ? data?.data?.message?.map((m) => toast.error(m.message)) : toast.error(data?.data?.message);

//         //
//         // toast.error(data?.data?.infomessage);
//         return;
//       }  else if (data?.data?.infomessage) {
//         console.log('LoginError22', data?.data?.message);

//         toast.error(data?.data?.infomessage);
//         return;
//       } else {
//         toast.info('something unexpected happened');
//         return;
//       }
//     },
//     onError: (error) => {
//       console.log('LoginError22__', error);
//       const {
//         response: { data },
//       } = error ?? {};
//       Array.isArray(data?.message) ? data?.message?.map((m) => toast.error(m)) : toast.error(data?.message);
//     },
//   });
// }

//   export function useUserLogin() {
//     const router = useRouter()
//     return useMutation(userSignIn, {
//         onSuccess: (data) => {
//             if (data?.data?.accessToken && data?.data?.user) {
//                 setAuthCredentials(data?.data?.user)
//                 setAuthTokens(data?.data?.accessToken)
//                 toast.success('logged in successfully')

//                 router.push(`${CLIENT_ENDPOINTS.LACHARIZ_LISTINGS}`)
//                 return
//             } else if (data?.data?.error) {
//                 toast.error(data?.data?.error?.message)
//                 return
//             } else {
//                 toast.info('something unexpected happened')
//                 return
//             }
//         },
//         onError: (error) => {
//             const {
//                 response: { data },
//             }: any = error ?? {}
//             data?.message?.map((m: []) => toast.error(m))
//         },
//     })
// }

//   export const useLogoutMutation = () => {
//     const router = useRouter();

//     return useMutation(logOutAdmin, {
//       onSuccess: () => {
//         Cookies.remove(AUTH_CRED);
//         router.replace(CLIENT_ENDPOINTS.ADMIN_LOGIN);
//         // toast.success(t('common:successfully-logout'), {
//         //   messageId: 'logoutSuccess',
//         // });
//       },
//     });
//   };

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
