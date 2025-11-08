import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  createCountry,
  createCountryShippingTable,
  deleteCountryById,
  deleteCountryShippingTableById,
  getCountries,
  getCountriesWithShippinTable,
  getCountriesWithShippinTableExcludeOrigin,
  getCountryById,
  getOperationalCountries,
  updateCountryById,
  updateCountryShippingTableById,
} from "../apiRoutes";
import { useNavigate } from "react-router";

export default function useCountries(params = {}) {
  return useQuery(["__countries", params], () => getCountries(params), {
    keepPreviousData: true,
    staleTime: 30000,
  });
} //(Msvs => Done)

// Paginated hook for countries
export function useCountriesPaginated({
  page = 0,
  limit = 20,
  search = "",
  filters = {},
}) {
  const offset = page * limit;

  return useQuery(
    ["__countries_paginated", { page, limit, search, filters }],
    () =>
      getCountries({
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

//operational
export function useOperationalCountries() {
  return useQuery(["__operational_countries"], getOperationalCountries);
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation(
    (newCountry) => {
      return createCountry(newCountry);
    },

    {
      onSuccess: (data) => {
        if (data?.data) {
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
      if (data?.data?.success) {
        toast.success("country updated successfully!!");
        queryClient.invalidateQueries("__countries");
      }
    },
    onError: (error) => {
      toast.success("Oops!, an error occured");
    },
  });
} //(Msvs => Done)

/***Delete a county */
export function useDeleteSingleCountry() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteCountryById, {
    onSuccess: (data) => {
      if (data?.data?.success) {
        toast.success(data?.data?.message || "country deleted successfully!!");
        queryClient.invalidateQueries("__countries");
        navigate("/administrations/countries");
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

/*****
 * #####################################################################
 * HANDLE SHIPPING-ROUTES-TABLE STARTS
 * #####################################################################
 */

export function useCountriesWithShippingTable() {
  return useQuery(["__countries_shippintables"], getCountriesWithShippinTable);
}

export function useCountriesWithShippingTableOriginExcluded(countryId) {
  if (!countryId || countryId === "new") {
    return "";
  }
  return useQuery(
    ["__countriesOriginExcluded", countryId],
    () => getCountriesWithShippinTableExcludeOrigin(countryId),
    {
      enabled: Boolean(countryId),
      // staleTime: 5000,
    }
  );
}

//Add To Country Shipping Table country
export function useCountryAddShippingTableMutation() {
  const queryClient = useQueryClient();

  return useMutation(createCountryShippingTable, {
    onSuccess: (data) => {
      console.log("NEW-SHIPMENT-ADD", data);
      if (data?.data?.success) {
        toast.success("country shipping table aded successfully!!");
        toast.success(`${data?.message ? data?.message : data?.data?.message}`);
        queryClient.invalidateQueries("__countries");
      }
    },
    onError: (error) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    },
  });
}

/*****update Country Shipping Table  country */
export function useCountryUpdateShippingMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateCountryShippingTableById, {
    onSuccess: (data) => {
      if (data?.data?.success) {
        console.log("Updated-SHIPMENT", data?.data);
        toast.success("country shipping table updated successfully!!");
        // toast.success(`${data?.message ? data?.message : data?.data?.message}`);
        queryClient.invalidateQueries("__countries");
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

/*****update Country Shipping Table  country */
export function useCountryDeleteShippingMutation() {
  const queryClient = useQueryClient();

  return useMutation(deleteCountryShippingTableById, {
    onSuccess: (data) => {
      if (data?.data?.success) {
        console.log("Updated-SHIPMENT", data?.data);
        toast.success("country shipping table deleted successfully!!");
        // toast.success(`${data?.message ? data?.message : data?.data?.message}`);
        queryClient.invalidateQueries("__countries");
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

/*****
 * #####################################################################
 * HANDLE SHIPPING-ROUTES-TABLE ENDS
 * #####################################################################
 */
