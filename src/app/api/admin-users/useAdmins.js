import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createMarket,
  getMarketById,
  getMarkets,
  updateMarketById,
  //admins
  getApiAdminUsers,
  createApiAdminUser,
  updateApiAdminUserById,
  getApiAdminUserById,
  adminBlockDisciplineStaff,
  adminUnBlockDisciplineStaff,
  adminSuspendDisciplineStaff,
  adminUnSuspendDisciplineStaff,
  adminMakeLeader,
  adminUnMakeLeader,
  createRecruitAdminUserApi,
  newAdminUserInviteAcceptanceEndpoint,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

export default function useAdminUsers() {
  return useQuery(['__admins'], getApiAdminUsers);
} //done

//get single market
export function useSingleAdminStaff(staffId) {
  return useQuery(
    ['__adminById', staffId],
    () => getApiAdminUserById(staffId),
  
    {
      enabled: Boolean(staffId),
      // staleTime: 2000,
    }
  );
}

//create new  AdminStaff
export function useAddAdminStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (newAdminStaff) => {
      return createApiAdminUser(newAdminStaff);
    },

    {
      onSuccess: (data) => {

        return
        if (data) {
          toast.success('Adminstaff  added successfully!');
          queryClient.invalidateQueries(['__admins']);
          queryClient.refetchQueries('__admins', { force: true });
        }
      },
    },
    {
      onError: (error, values, rollback) => {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        rollback();
      },
    }
  );
}



//update existing AdminStaff market
export function useAdminStaffUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateApiAdminUserById, {
    onSuccess: (data) => {
      toast.success('Admin staff  updated successfully!!');
      queryClient.invalidateQueries('__admins');
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}

//Block existing AdminStaff market
export function useAdminStaffBlockMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminBlockDisciplineStaff, {
    onSuccess: (data) => {
      if (data?.data) {
        toast.success('Adminstaff  blocked successfully!!');
        queryClient.invalidateQueries('__admins');
      }
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}

//UnBlock existing AdminStaff market
export function useAdminStaffUnBlockMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminUnBlockDisciplineStaff, {
    onSuccess: (data) => {
      if (data?.data) {
        toast.success('Adminstaff un-blocked successfully!!');
        queryClient.invalidateQueries('__admins');
      }
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}

//Suspend existing AdminStaff market
export function useAdminStaffSuspenMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminSuspendDisciplineStaff, {
    onSuccess: (data) => {
      if (data?.data) {
        toast.success('Adminstaff suspended successfully!!');
        queryClient.invalidateQueries('__admins');
      }
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}

//Un-Suspend existing AdminStaff market adminUnSuspendDisciplineStaff
export function useAdminStaffUnSuspednMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminUnSuspendDisciplineStaff, {
    onSuccess: (data) => {
      toast.success('Adminstaff un-suspended successfully!!');
      queryClient.invalidateQueries('__admins');
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}

//Make Leadership to existing AdminStaff market adminUnSuspendDisciplineStaff
export function useAdminStaffMakeLeaderMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminMakeLeader, {
    onSuccess: (data) => {
      toast.success('Adminstaff made leader successfully!!');
      queryClient.invalidateQueries('__admins');
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}

//Un-Make Leadership to existing AdminStaff market adminUnSuspendDisciplineStaff
export function useAdminStaffUnMakeLeaderMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminUnMakeLeader, {
    onSuccess: (data) => {
      toast.success('Adminstaff leader removed successfully!!');
      queryClient.invalidateQueries('__admins');
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}




/******
 * #######################################################
 * INVITATION OF NEW ADMIN STAFF STARTS
 * #######################################################
 */


/***Recruite New Admins */
export function useAdminRecruitAfricanshopStaff() {
  const navigate = useNavigate();
  //   const queryClient = useQueryClient()
  return useMutation(createRecruitAdminUserApi, {
    onSuccess: (data) => {
      console.log("ADMIN-INVITATION-PAYLOAD", data?.data);
      // return
      if (data?.data?.success && data?.data?.activation_token) {
        //   window.alert('Admin Invite Sent, Acceptance Pending')
        toast.success("Admin Invite Sent, Acceptance Pending");
        navigate("/users/admin");
        return;
      } else if (data?.data?.error) {
        toast.error(
          data?.data?.error?.response && error?.response?.data?.message
            ? error?.response?.data?.message
            : error?.message
        );
        //   toast.error(data?.data?.error?.message)
        //   console.log("In-BoundError:", data?.data?.error)
        return;
      } else {
        toast.info("something unexpected happened");
        return;
      }
    },
    onError: (error) => {
      // const {
      //   response: { data },
      // } = error ?? {};

      // Array.isArray(data?.message)
      //   ? data?.message?.map((m) => toast.error(m))
      //   : toast.error(data?.message);
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );

    },
  });
}



/***Admin Accept Invites */
export function useNewAdminInvitationAcceptance() {
  const navigate = useNavigate();
  // const queryClient = useQueryClient()
  return useMutation(newAdminUserInviteAcceptanceEndpoint, {
    onSuccess: (data) => {
      console.log("ADMIN-ACCEPT-INVITATION-PAYLOAD", data?.data);
      //    return
      if (data?.data?.success && data?.data?.adminuser) {
        toast.success("Invitation Accepted, Welcome Onboard, Please Log in.");
        navigate("/sign-in");
        return;
      } 
      // else if (data?.data?.error) {
      //   toast.error(
      //     data?.data?.error?.response && error?.response?.data?.message
      //       ? error?.response?.data?.message
      //       : error?.message
      //   );
      //   return;
      // } 
      else {
        toast.info('something unexpected happened')
        return;
      }
    },
    onError: (error) => {
      // onsole.log("In-BoundError222:", error);
      // const {
      //   response: { data },
      // } = error ?? {};

      // Array.isArray(data?.message)
      //   ? data?.message?.map((m) => toast.error(m))
      //   : toast.error(data?.message);
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );

    },
  });
}