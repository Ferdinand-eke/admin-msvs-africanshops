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
}

//get single designation
export function useSingleDesignation(desigId) {
  if (!desigId || desigId === "new") {
    return "";
  }
  return useQuery(['designation', desigId], () => getDesigById(desigId), {
    enabled: Boolean(desigId),
    // staleTime: 5000,
  });
}

/*******create new designation */
export function useDesigtMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (newDesignation) => {
      console.log('Run: ', newDesignation);
      return createDesignation(newDesignation);
    },

    {
      onSuccess: (data) => {
        if (data?.data) {
          toast.success('Designation added successfully!');
          queryClient.invalidateQueries(['designations']);
          queryClient.refetchQueries('designations', { force: true });
          navigate("/designations/list")
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
        if (data?.data) {
          toast.success('Designation updated successfully!');
          queryClient.invalidateQueries(['designations']);
          queryClient.refetchQueries('designations', { force: true });
          navigate("/designations/list")
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
