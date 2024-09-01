import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  createCountry,
  createCountryShippingTable,
  deleteCountryById,
  getCountries,
  getCountriesWithShippinTable,
  getCountryById,
  getOperationalCountries,
  updateCountryById,
  updateCountryShippingTableById,
} from "../apiRoutes";
import { useNavigate } from "react-router";

export default function useCountries() {
  return useQuery(["__countries"], getCountries);
}
//operational
export function useOperationalCountries() {
  return useQuery(["__operational_countries"], getOperationalCountries);
}

export function useCountriesWithShippingTable() {
  return useQuery(["__countries_shippintables"], getCountriesWithShippinTable);
}

//get single country
export function useSingleCountry(countryId) {
  if (!countryId || countryId === "new") {
    return "";
  }
  return useQuery(["__countries", countryId], () => getCountryById(countryId), {
    enabled: Boolean(countryId),
    // staleTime: 5000,
  });
}

//create new country
export function useAddCountryMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (newCountry) => {
      console.log("Run: ", newCountry);
      return createCountry(newCountry);
    },

    {
      onSuccess: (data) => {
        if (data?.data) {
          // console.log("New Country Data", data?.data);
          toast.success("Country added successfully!");
          queryClient.invalidateQueries(["__countries"]);
          queryClient.refetchQueries("__countries", { force: true });
          navigate("/administrations/countries");
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
        console.log("MutationError", error.response.data);
        console.log("MutationError", error.data);
        rollback();
      },
    }
  );
}

//update new country
export function useCountryUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateCountryById, {
    onSuccess: (data) => {
      console.log("UPDATE_COUNTY:DATA", data);
      if (data?.data) {
        toast.success("country updated successfully!!");
        queryClient.invalidateQueries("__countries");
      }
    },
    onError: (error) => {
      toast.success("Oops!, an error occured");
    },
  });
}

//Add To Country Shipping Table country
export function useCountryAddShippingTableMutation() {
  const queryClient = useQueryClient();

  return useMutation(createCountryShippingTable, {
    onSuccess: (data) => {
      if (data) {
        console.log("New CountryShippingTable Data", data);
        // toast.success('Country added successfully!');
        // queryClient.invalidateQueries(['__countries']);
        // queryClient.refetchQueries('__countries', { force: true });
        toast.success("country shipping table aded successfully!!");
        toast.success(`${data?.message ? data?.message : data?.data?.message}`);
        queryClient.invalidateQueries("__countries");
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

//update Country Shipping Table  country
export function useCountryUpdateShippingMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateCountryShippingTableById, {
    onSuccess: (data) => {
      toast.success("country shipping table updated successfully!!");
      toast.success(`${data?.message ? data?.message : data?.data?.message}`);
      queryClient.invalidateQueries("__countries");
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

/***Delete a county */
export function useDeleteSingleCountry() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteCountryById, {
    onSuccess: (data) => {
      toast.success("country deleted successfully!!");
      queryClient.invalidateQueries("__countries");
      navigate("/administrations/countries");
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
