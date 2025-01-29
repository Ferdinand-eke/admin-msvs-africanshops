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


/***1) Get all admin staff */
export default function useAdminUsers() {
  return useQuery(['__admins'], getApiAdminUsers);
} 

/****2) Admin get single admin data" */
export function useSingleAdminStaff(staffId) {
  return useQuery(
    ['__adminById', staffId],
    () => getApiAdminUserById(staffId),
  
    {
      enabled: Boolean(staffId),
    }
  );
}

/**** 3) Admin create/invite new  Admin-Staff" */
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


/**** 4) Admin update  Admin-Staff data" */
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

/**** 5) Admin Disciplinary: Block existing AdminStaff  */
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


/**** 6) Admin Disciplinary: UnBlock existing AdminStaff  */
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

/**** 7) Admin Disciplinary: Suspend existing  AdminStaff  */
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

/**** 8) Admin Disciplinary: Un-Suspend existing AdminStaff  */
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

/**** 9) Admin Upgrade: Make Leadership to existing AdminStaff  */
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

/**** 10) Admin Upgrade: Un-Make Leadership to existing AdminStaff market  */
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
 * ############################################################
 *          INVITATION OF NEW ADMIN STAFF STARTS              #
 * ############################################################
 */


/*** 1) Recruite New Admins */
export function useAdminRecruitAfricanshopStaff() {
  const navigate = useNavigate();
  return useMutation(createRecruitAdminUserApi, {

    onSuccess: (data) => {
      console.log("ADMIN-INVITATION-PAYLOAD", data);
      // return
      if (data?.data?.success ) {
        toast.success("Admin Invite Sent, Acceptance Pending");
        navigate("/users/admin");
        return;
      } else if (data?.data?.error) {
        toast.error(
          data?.data?.error?.response && error?.response?.data?.message
            ? error?.response?.data?.message
            : error?.message
        );
        return;
      } else {
        toast.info("something unexpected happened");
        return;
      }
    },
    onError: (error) => {
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
  return useMutation(newAdminUserInviteAcceptanceEndpoint, {
    onSuccess: (data) => {
      console.log("ADMIN-ACCEPT-INVITATION-PAYLOAD", data);
      //    return && data?.data?.adminuser?._id
      if (data?.data?.success ) {
        toast.success(`${data?.data?.message ? data?.data?.message : "Invitation Accepted, Welcome Onboard, Please Log in."}`);
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
      // else {
      //   toast.info('something unexpected happened')
      //   return;
      // }
    },
    onError: (error) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );

    },
  });
}