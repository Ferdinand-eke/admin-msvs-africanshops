import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createBState,
  deleteStateById,
  getBStates,
  getStateById,
  updateStateById,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

export default function useStates() {
  return useQuery(['states'], getBStates);
}

//get single state
export function useSingleState(stateId) {
  if (!stateId || stateId === "new") {
    return "";
  }
  return useQuery(['states', stateId], () => getStateById(stateId), {
    enabled: Boolean(stateId),
    // staleTime: 5000,
  });
}

//create new state
export function useAddStateMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation(
    (newState) => {
      // console.log('Run: ', newState);
      return createBState(newState);
    },

    {
      onSuccess: (data) => {
        console.log('New state Data', data);
        if (data?.data) {
          // console.log('New state Data', data);
          toast.success('State added successfully!');
          queryClient.invalidateQueries(['states']);
          queryClient.refetchQueries('states', { force: true });
          navigate('/administrations/states');
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
        // console.log('MutationError', error.response.data);
        // console.log('MutationError', error.data);
        rollback();
      },
    }
  );
}

/***update existing state */
export function useStateUpdateMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(updateStateById, {
    onSuccess: (data) => {
      // console.log('Updated State Data', data);
      if (data?.data) {
        // console.log('Updated State Data-2', data);
        toast.success('state updated successfully!!');
        queryClient.invalidateQueries('states');
        queryClient.refetchQueries('states', { force: true });
        navigate('/administrations/states');
      }
    },
    onError: (error) => {
      console.log('Updated State error', error);
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      // toast.error('Oops!, an error occured');
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}


/***Delete a county */
export function useDeleteSingleState() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  return useMutation(deleteStateById, {
    onSuccess: (data) => {
      toast.success("state deleted successfully!!");
      queryClient.invalidateQueries("__countries");
      navigate("/administrations/states");
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