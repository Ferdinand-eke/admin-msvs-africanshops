import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createDesignation,
  deleteDesignationById,
  getDesigById,
  getDesigs,
  updateDesigById,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

//get all designations
export default function useDesignations() {
  return useQuery(['designations'], getDesigs);
} //(Msvs => Done)

//get single designation
export function useSingleDesignation(desigId) {
  if (!desigId || desigId === "new") {
    return "";
  }
  return useQuery(['designation', desigId], () => getDesigById(desigId), 
  {
      keepPreviousData: true, // Keeps previous data while fetching new data
      enabled: Boolean(desigId) && desigId !== "new" // Only fetch when we have a valid deptId
    });
} //(Msvs => Done)

/*******create new designation */
export function useDesigtMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (newDesignation) => {
      return createDesignation(newDesignation);
    },

    {
      onSuccess: (data) => {
        if (data?.data?.success) {
          toast.success('Designation added successfully!');
          queryClient.invalidateQueries(['designations']);
          queryClient.refetchQueries('designations', { force: true });
          navigate("/designations/list")
        }
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

/*******update new designation */
export function useDesigUpdateMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (designation) => {
      return updateDesigById(designation);
    },

    {
      onSuccess: (data) => {
        if (data?.data?.success) {
          toast.success('Designation updated successfully!');
          queryClient.invalidateQueries(['designations']);
          queryClient.refetchQueries('designations', { force: true });
          navigate("/designations/list")
        }
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
} //(Msvs => Done)


/***Delete a desigation */
export function useDeleteDesignation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteDesignationById, {
    onSuccess: (data) => {
     if(data?.data){
      toast.success("designation deleted successfully!!");
      queryClient.invalidateQueries("designations");
      navigate("/designations/list");
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
