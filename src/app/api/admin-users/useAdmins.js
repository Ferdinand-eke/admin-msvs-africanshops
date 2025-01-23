import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
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
  getApiAdminUserByIdNotPopulated,
  adminDeleteAdminStaff,
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


/****2.1) Admin get single admin data (not populated)" */
export function useNonPopulatedSingleAdminStaff(staffId) {

  if (!staffId || staffId === "new") {
    return "";
  }
  return useQuery(
    ['__adminByIdNonPopulated', staffId],
    () => getApiAdminUserByIdNotPopulated(staffId),
  
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

      if (data?.data?.success) {
        toast.success(`${data?.data?.message ? data?.data?.message : "Admin staff  updated successfully!!"}`,{
          position: "top-left"
        });
        queryClient.invalidateQueries('__adminById');
        queryClient.invalidateQueries(['__admins']);
        queryClient.refetchQueries('__adminById', { force: true });
        queryClient.refetchQueries('__admins', { force: true });
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

/**** 5) Admin Disciplinary: Block existing AdminStaff  */
export function useAdminStaffBlockMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminBlockDisciplineStaff, {
    onSuccess: (data) => {
      if (data?.data?.success) {
        toast.success(`${data?.data?.message ? data?.data?.message : "Adminstaff  blocked successfully!!"}`,{
          position: "top-left"
        });
        queryClient.invalidateQueries('__adminById');
        queryClient.refetchQueries('__adminById', { force: true });
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
      if (data?.data?.success) {
        toast.success(`${data?.data?.message ? data?.data?.message : "Adminstaff un-blocked successfully!!"}`,{
          position: "top-left"
        });
        queryClient.invalidateQueries('__adminById');
        queryClient.refetchQueries('__adminById', { force: true });
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
      if (data?.data?.success) {
        toast.success(`${data?.data?.message ? data?.data?.message : "Adminstaff suspended successfully!!"}`,{
          position: "top-left"
        });
        queryClient.invalidateQueries('__adminById');
        queryClient.refetchQueries('__adminById', { force: true });
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
     if(data?.data?.success){
      toast.success(`${data?.data?.message ? data?.data?.message : "Suspension lifted successfully!!"}`,{
        position: "top-left"
      });
      queryClient.invalidateQueries('__adminById');
      queryClient.refetchQueries('__adminById', { force: true });

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

/**** 9) Admin Upgrade: Make Leadership to existing AdminStaff  */
export function useAdminStaffMakeLeaderMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminMakeLeader, {
    onSuccess: (data) => {
      toast.success('Adminstaff made leader successfully!!',{
        position: "top-left"
      });
      queryClient.invalidateQueries('__adminById');
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
      queryClient.invalidateQueries('__adminById');
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

/**** 11) Admin Handling: Delete and existing AdminStaff  */
export function useDeleteAdminStaffMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  return useMutation(adminDeleteAdminStaff, {
    onSuccess: (data) => {
     if(data?.data?.success){
      toast.success(`${data?.data?.message ? data?.data?.message : "Admin deleted successfully!!"}`,{
        position: "top-left"
      });
      
      queryClient.invalidateQueries('__adminById');
      queryClient.invalidateQueries('__admins');
      queryClient.refetchQueries('__admins', { force: true });
      navigate('/users/admin')


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





/*** 2) Admin Accept Invites */
export function useNewAdminInvitationAcceptance() {
  const navigate = useNavigate();
  return useMutation(newAdminUserInviteAcceptanceEndpoint, {
    onSuccess: (data) => {
      if (data?.data?.success ) {
        toast.success(`${data?.data?.message ? data?.data?.message : "Invitation Accepted, Welcome Onboard, Please Log in."}`);
        navigate("/sign-in");
        return;
      } 
      else if (data?.data?.error) {
        toast.error(
          data?.data?.error?.response && error?.response?.data?.message
            ? error?.response?.data?.message
            : error?.message
        );
        return;
      } 
      else {
        toast.info('something unexpected happened')
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