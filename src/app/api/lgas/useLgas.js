import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createBLga,
  deleteLgaById,
  getBLgas,
  getLgaById,
  getStateById,
  updateLgaById,
  updateStateById,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

export default function useLgas() {
  return useQuery(['lgas'], getBLgas);
}

//get single lga
export function useSingleLga(lgaId) {
  if (!lgaId || lgaId === "new") {
    return "";
  }
  return useQuery(['lgas', lgaId], () => getLgaById(lgaId), {
    enabled: Boolean(lgaId),
    // staleTime: 5000,
  });
}

//create new lga
export function useAddLgaMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation(
    (newLga) => {
      return createBLga(newLga);
    },

    {
      onSuccess: (data) => {
        console.log('New state Data', data);
        if (data?.data) {
          
          toast.success('L.G.A added successfully!');
          queryClient.invalidateQueries(['lgas']);
          queryClient.refetchQueries('lgas', { force: true });
          navigate('/administrations/lgas');
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

//update existing L.G.A
export function useLgaUpdateMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(updateLgaById, {
    
    onSuccess: (data) => {
      console.log('Updated state Data', data);
      if(data?.data){
        toast.success('L.G.A updated successfully!!');
        queryClient.invalidateQueries('lgas');
        queryClient.refetchQueries('lgas', { force: true });
        navigate('/administrations/lgas');
      }
   
    },
    onError: (error, rollback) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      rollback();
      // toast.success('Oops!, an error occured');
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}


/***Delete L.G.A/County */
export function useDeleteSingleLGA() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteLgaById, {
    onSuccess: (data) => {
      if(data?.data){
        toast.success("L.G.A deleted successfully!!");
        queryClient.invalidateQueries("__countries");
        navigate('/administrations/lgas');
      }
  
    },
    onError: () => {
      toast.success(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    },
  });
}
