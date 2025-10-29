
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
}; //(Msvs => Done)

/***Get department by ID */
export function useGetDepartmentById(deptId) {
  if (!deptId || deptId === "new") {
    return "";
  }
  return useQuery(
    ['getDepartmentsQuery', deptId],
    () => getDeptById(deptId),
    {
      keepPreviousData: true, // Keeps previous data while fetching new data
      enabled: Boolean(deptId) && deptId !== "new" // Only fetch when we have a valid deptId
    }
  );
}// (Msvs => Done)

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
      if (err) {
        return toast.error('Oops!, an error occured');
      }
      if (err && err.status === 403) {
        // signOut();
      }
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}

//updating existing department
export function useUpdateDepartmentMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (designation) => {
      return updateDeptById(designation);
    },

    {
      onSuccess: (data) => {
        console.log("department-Update-success", data)
        // if (data) {
          if(data?.data?.success){
            toast.success('Departent updated successfully!');
          queryClient.invalidateQueries(['getDepartmentsQuery']);
          queryClient.refetchQueries('getDepartmentsQuery', { force: true });
          navigate('/departments/list')
          }
        // }
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
    onError: (error) => {
      toast.success(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    },
  });
}


