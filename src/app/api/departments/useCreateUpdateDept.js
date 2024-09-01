import { useMutation, useQuery, useQueryClient } from '/react-query';
import {
  createDepartment,
  getDepartment,
  getDepartmentsByPublished,
  updateDepartment,
} from './department';

const queryClient = useQueryClient();

export const deptMutation = useMutation(
  (newDepartment) => {
    return createDepartment(newDepartment);
  },

  {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['departments']);
      queryClient.refetchQueries('departments', { force: true });
    },
  },
  {
    onError: (err, values, rollback) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      rollback();
    },
  }
);

export const deptUpdateMutation = useMutation(
  (id, newDepartment) => {
    return updateDepartment(id, newDepartment);
  },

  {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['departments']);
      queryClient.refetchQueries('departments', { force: true });
    },
  },
  {
    onError: (err, values, rollback) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      rollback();
    },
  }
);

export const useGetSingleDepartment = (deptId) => {
  return useQuery(['department', deptId], () => getDepartment(deptId), {
    enabled: Boolean(deptId),
    staleTime: 5000,
  });
};

export const useDepartments = () => {
  return useQuery(['departments'], getDepartmentsByPublished);
};
