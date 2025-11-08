import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  createBState,
  deleteStateById,
  getBStates,
  getStateById,
  updateStateById,
} from "../apiRoutes";
import { useNavigate } from "react-router";

export default function useStates(params = {}) {
  return useQuery(["states", params], () => getBStates(params), {
    keepPreviousData: true,
    staleTime: 30000,
  });
}

// Paginated hook for states
export function useStatesPaginated({
  page = 0,
  limit = 20,
  search = "",
  filters = {},
}) {
  const offset = page * limit;

  return useQuery(
    ["states_paginated", { page, limit, search, filters }],
    () =>
      getBStates({
        limit,
        offset,
        search,
        ...filters,
      }),
    {
      keepPreviousData: true,
      staleTime: 30000,
    }
  );
}

//get single state
export function useSingleState(stateId) {
  if (!stateId || stateId === "new") {
    return "";
  }
  return useQuery(["states", stateId], () => getStateById(stateId), {
    enabled: Boolean(stateId),
  });
}

//create new state
export function useAddStateMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation(
    (newState) => {
      return createBState(newState);
    },

    {
      onSuccess: (data) => {
        if (data?.data?.success) {
          toast.success("State added successfully!");
          queryClient.invalidateQueries(["states"]);
          queryClient.refetchQueries("states", { force: true });
          navigate("/administrations/states");
        }
      },
    },
    {
      onError: (error, values, rollback) => {
        // Handle NestJS error format
        let errorMessage = "An error occurred";

        if (error.response?.data) {
          const { message, error: errorType } = error.response.data;

          // NestJS can return message as string or array
          if (Array.isArray(message)) {
            errorMessage = message.join(", ");
          } else if (message) {
            errorMessage = message;
          } else if (errorType) {
            errorMessage = errorType;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
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
      if (data?.data?.success) {
        toast.success("state updated successfully!!");
        queryClient.invalidateQueries("states");
        queryClient.refetchQueries("states", { force: true });
        navigate("/administrations/states");
      }
    },
    onError: (error) => {
      console.log("Updated State error", error);

      // Handle NestJS error format
      let errorMessage = "An error occurred while updating state";

      if (error.response?.data) {
        const { message, error: errorType } = error.response.data;

        // NestJS can return message as string or array
        if (Array.isArray(message)) {
          errorMessage = message.join(", ");
        } else if (message) {
          errorMessage = message;
        } else if (errorType) {
          errorMessage = errorType;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });
} // (Msvs => Done)

/***Delete a county */
export function useDeleteSingleState() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteStateById, {
    onSuccess: (data) => {
      if (data?.data?.success) {
        toast.success("state deleted successfully!!");
        queryClient.invalidateQueries("__countries");
        navigate("/administrations/states");
      }
    },
    onError: (error) => {
      // Handle NestJS error format
      let errorMessage = "An error occurred while deleting state";

      if (error.response?.data) {
        const { message, error: errorType } = error.response.data;

        // NestJS can return message as string or array
        if (Array.isArray(message)) {
          errorMessage = message.join(", ");
        } else if (message) {
          errorMessage = message;
        } else if (errorType) {
          errorMessage = errorType;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });
}// (Msvs => Done)
