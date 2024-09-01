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
} from '../../store-redux/api/apiRoutes';

export default function useAdminUsers() {
  return useQuery(['__admins'], getApiAdminUsers);
} //done

//get single market
export function useSingleAdminStaff(staffId) {
  return useQuery(
    ['__adminById', staffId],
    () => getApiAdminUserById(staffId),
    // {
    //   if (staffId) {
    //     getApiAdminUserById(staffId);
    //   }
    // },
    {
      enabled: Boolean(staffId),
      staleTime: 2000,
    }
  );
}

//create new  AdminStaff
export function useAddAdminStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (newAdminStaff) => {
      console.log('Run Adminstaff : ', newAdminStaff);
      return createApiAdminUser(newAdminStaff);
    },

    {
      onSuccess: (data) => {
        if (data) {
          console.log('New Adminstaff  Data', data);
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
        console.log('MutationError', error.response.data);
        console.log('MutationError', error.data);
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
      console.log('Updated Adminstaff  Data', data);
      toast.success('Admin staff  updated successfully!!');
      queryClient.invalidateQueries('__admins');
    },
    onError: (err) => {
      // toast.error('Oops!, an error occured', err);
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

//Block existing AdminStaff market
export function useAdminStaffBlockMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminBlockDisciplineStaff, {
    onSuccess: (data) => {
      if (data?.data) {
        console.log('Block Adminstaff  Data', data);
        toast.success('Adminstaff  blocked successfully!!');
        queryClient.invalidateQueries('__admins');
      }
    },
    onError: (err) => {
      // toast.error('Oops!, an error occured', err);
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

//UnBlock existing AdminStaff market
export function useAdminStaffUnBlockMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminUnBlockDisciplineStaff, {
    onSuccess: (data) => {
      if (data?.data) {
        console.log('Un-Block Adminstaff  Data', data);
        toast.success('Adminstaff un-blocked successfully!!');
        queryClient.invalidateQueries('__admins');
      }
    },
    onError: (err) => {
      // toast.error('Oops!, an error occured', err);
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

//Suspend existing AdminStaff market
export function useAdminStaffSuspenMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminSuspendDisciplineStaff, {
    onSuccess: (data) => {
      if (data?.data) {
        console.log('Un-Block Adminstaff  Data', data?.data);
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
      console.log('Un-Suspend Adminstaff  Data', data);
      toast.success('Adminstaff un-suspended successfully!!');
      queryClient.invalidateQueries('__admins');
      // queryClient.refetchQueries('__admins', { force: true });

      // navigate('/transaction-list');
    },
    onError: (err) => {
      // toast.error('Oops!, an error occured', err);
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

//Make Leadership to existing AdminStaff market adminUnSuspendDisciplineStaff
export function useAdminStaffMakeLeaderMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminMakeLeader, {
    onSuccess: (data) => {
      console.log('Make leader Adminstaff  Data', data);
      toast.success('Adminstaff made leader successfully!!');
      queryClient.invalidateQueries('__admins');
      // queryClient.refetchQueries('__admins', { force: true });

      // navigate('/transaction-list');
    },
    onError: (err) => {
      // toast.error('Oops!, an error occured', err);
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

//Un-Make Leadership to existing AdminStaff market adminUnSuspendDisciplineStaff
export function useAdminStaffUnMakeLeaderMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminUnMakeLeader, {
    onSuccess: (data) => {
      console.log('Un-Make leader Adminstaff  Data', data);
      toast.success('Adminstaff leader removed successfully!!');
      queryClient.invalidateQueries('__admins');
      // queryClient.refetchQueries('__admins', { force: true });

      // navigate('/transaction-list');
    },
    onError: (err) => {
      // toast.error('Oops!, an error occured', err);
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}
