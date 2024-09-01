
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  createDepartMent,
  deleteDepartmentById,
  getDeptById,
  getDepts,
  updateDeptById,
} from '../apiRoutes';

export const useGetDepartments = () => {
  return useQuery('getDepartmentsQuery', getDepts);
};

/***Get department by ID */
export function useGetDepartmentById(deptId) {
  if (!deptId || deptId === "new") {
    return "";
  }
  return useQuery(['getDepartmentsQuery', deptId], () =>
  getDeptById(deptId)
  );
}

//creating new Department
export function useAddDeptMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(createDepartMent, {
    onSuccess: (data) => {
     if(data?.data){
      toast.success('Departent added successfully!');
      queryClient.invalidateQueries('getDepartmentsQuery');
      navigate('/departments/list')
     }
   
    },
    onError: (error, query) => {
      if (error) {
        return toast.error('Oops!, an error occured');
      }
      if (error && error.status === 401) {
        console.log('Signing out');
        // signOut();
      }
    },
  });
}

//updating existing department
export function useUpdateDepartmentMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (designation) => {
      // console.log('Run Update: ', designation);
      return updateDeptById(designation);
    },

    {
      onSuccess: (data) => {
        if (data) {
          if(data?.data){
            console.log("UPDATED-DEPT", data?.data)
            toast.success('Departent updated successfully!');
          queryClient.invalidateQueries(['getDepartmentsQuery']);
          queryClient.refetchQueries('getDepartmentsQuery', { force: true });
          navigate('/departments/list')
          }
        }
      },
    },
    {
      onError: (error, values, rollback) => {
        console.log('MutationError', error.response.data);
        rollback();
      },
    }
  );
}

/***Delete a department */
export function useDeleteSingleDepartment() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteDepartmentById, {
    onSuccess: (data) => {
    if(data?.data){
      toast.success("country deleted successfully!!");
      queryClient.invalidateQueries("__countries");
      navigate("/departments/list");
    }
    },
    onError: () => {
      // toast.success('Oops!, an error occured');
      toast.success(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    },
  });
}


