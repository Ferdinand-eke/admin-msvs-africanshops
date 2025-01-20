import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import FuseLoading from "@fuse/core/FuseLoading";
import _ from "@lodash";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/system/Box";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import history from "@history";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useAppDispatch } from "app/store/hooks";
import ContactEmailSelector from "./email-selector/ContactEmailSelector";
import PhoneNumberSelector from "./phone-number-selector/PhoneNumberSelector";
import {
  useCreateContactsItemMutation,
  useDeleteContactsItemMutation,
  useGetContactsItemQuery,
  useGetContactsTagsQuery,
  useUpdateContactsItemMutation,
} from "../ContactsApi";
import ContactModel from "../models/ContactModel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  useAdminRecruitStaff,
  useGetAdminById,
} from "src/app/aaqueryhooks/adminHandlingQuery";
import {
  useAdminRecruitAfricanshopStaff,
  useAdminStaffUpdateMutation,
  useDeleteAdminStaffMutation,
  useNonPopulatedSingleAdminStaff,
  useSingleAdminStaff,
} from "src/app/api/admin-users/useAdmins";
import { useGetDepartments } from "src/app/api/departments/useDepartments";
import {
  getDesigByDepartmentId,
  getLgaByStateId,
  getOfficeByLgaId,
  getStateByCountryId,
} from "src/app/api/apiRoutes";
import { Typography } from "@mui/material";
import useCountries from "src/app/api/countries/useCountries";
// import InputAdornment from '@mui/material/InputAdornment';
// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// import { useGetAdminById } from 'src/app/aaqueryhooks/adminHandlingQuery';

function BirtdayIcon() {
  return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

/**
 * Form Validation Schema
 */
// Zod schema for ContactEmail
const ContactEmailSchema = z.object({
  email: z.string().optional(),
  type: z.string().optional(),
});
// Zod schema for ContactPhoneNumber
const ContactPhoneNumberSchema = z.object({
  number: z.string().optional(),
  type: z.string().optional(),
});
const schema = z.object({
  avatar: z.string().optional(),
  background: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  // emails: z.array(ContactEmailSchema).optional(),
  email: z.string().optional(),
  // phoneNumbers: z.array(ContactPhoneNumberSchema).optional(),
  phone: z.string(ContactPhoneNumberSchema).optional(),
  // title: z.string().optional(),
  // company: z.string().optional(),
  birthday: z.string().optional(),
  address: z.string().optional(),
  // notes: z.string().optional(),
  // tags: z.array(z.string()).optional(),
});
// const schema = z.object({
// 	email: z.string().optional(),
// 	label: z.string().optional()
// });

const defaultValues = {
  avatar: "",
  name: "",
  officeCountry: "",
  officeState: "",
  officeLga: "",
  officeDesignate: "",
  market: "",
  department: "",
  designation: "",
  gender: "",
  email: "",
  phone: "",
  address: "",
  birthday: "",

  instagram: "",
  twitter: "",
  facebook: "",
  linkedin: "",
};


/**
 * The contact form.
 */

function AddStaffContactForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const routeParams = useParams();
  const { id: contactId } = routeParams;

  const {
    data: admin,
    isLoading: adminLoading,
    isError: adminIsError,
  } = useNonPopulatedSingleAdminStaff(contactId, {
    skip: !contactId,
  });

  const recruitStaff = useAdminRecruitAfricanshopStaff();
  const updateStaffInfo = useAdminStaffUpdateMutation()
  const deleteAdmin = useDeleteAdminStaffMutation()

  const { control,
     watch, 
     reset, 
     handleSubmit, 
     getValues, 
     formState 
    } = useForm(
    {
      defaultValues,
      mode: "all",
      resolver: zodResolver(schema),
    }
  );
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  const [loading, setLoading] = useState(false);

  const { data: countries, isFetching } = useCountries();
  const { data: departments } = useGetDepartments();

  const [designationsList, setDesignationList] = useState([]);
  const [bstates, setBstates] = useState([]);
  const [blgas, setBlgas] = useState([]);
  const [lgasOffices, setLgasOffices] = useState([]);


  useEffect(() => {
    if (getValues()?.department) {
      getDesignationData();
    }
    
    if (getValues()?.officeCountry) {
      getStateDFromCountryId(getValues()?.officeCountry);
    }

    if (getValues()?.officeState) {
      getLgasFromState(getValues()?.officeState);
    }

    if (getValues()?.officeLga) {
      getOfficesFromLga(getValues()?.officeLga);
    }
  }, [
    getValues()?.department,
    getValues()?.officeCountry,
    getValues()?.officeState,
    getValues()?.officeLga,
  ]);

  /** 1) Get States from country IDs  */
  async function getStateDFromCountryId(pid) {
    setLoading(true);
    const responseData = await getStateByCountryId(pid);
    if (responseData) {
      setBstates(responseData?.data);
      setTimeout(
        function () {
          setLoading(false);
        }.bind(this),
        250
      );
    }
  }

  /** 2) Get L.G.As from state_ID data */
  async function getLgasFromState(sid) {
    setLoading(true);
    const responseData = await getLgaByStateId(sid);
    if (responseData) {
      setBlgas(responseData?.data);
      setTimeout(
        function () {
          setLoading(false);
        }.bind(this),
        250
      );
    }
  }

  /** 3) Get L.G.As from state_ID data */
  async function getOfficesFromLga(sid) {
    setLoading(true);
    const responseData = await getOfficeByLgaId(sid);
    if (responseData) {
      setLgasOffices(responseData?.data);
      setTimeout(
        function () {
          setLoading(false);
        }.bind(this),
        250
      );
    }
  }

  /***4) Get desinations from department_ID*/
  const getDesignationData = async () => {
    setLoading(true);
    try {
      if (getValues()?.department) {
        await getDesigByDepartmentId(getValues()?.department).then(
          (response) => {
            setDesignationList(response.data);
          }
        );
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    reset(admin?.data);
  }, [admin?.data, reset]);

  /**
   * Form Submit
   */

  const onSubmit = useCallback(() => {
    recruitStaff.mutate(getValues());

    
  }, [getValues()]);

  const onUpdate = useCallback(() => {
    updateStaffInfo.mutate(getValues())
  }, [getValues()]);

  function handleRemoveAdmin(adminUserId) {
    if (window.confirm("Are you certain anout deleting this staff?")) {
      deleteAdmin.mutate(adminUserId)
    }
   
  }

  const background = watch("background");
  const name = watch("name");

  return (
    <>
      <Box
        className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
        sx={{
          backgroundColor: "background.default",
        }}
      >
        {background && (
          <img
            className="absolute inset-0 object-cover w-full h-full"
            src={background}
            alt="user background"
          />
        )}
      </Box>

      <div className="relative flex flex-col flex-auto  px-24 sm:px-48">
        {/* <div className="w-full">
          <div className="flex flex-auto items-end -mt-64">
            <Controller
              control={control}
              name="avatar"
              render={({ field: { onChange, value } }) => (
                <Box
                  sx={{
                    borderWidth: 4,
                    borderStyle: "solid",
                    borderColor: "background.paper",
                  }}
                  className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div>
                      <label
                        htmlFor="button-avatar"
                        className="flex p-8 cursor-pointer"
                      >
                        <input
                          accept="image/*"
                          className="hidden"
                          id="button-avatar"
                          type="file"
                          onChange={async (e) => {
                            function readFileAsync() {
                              return new Promise((resolve, reject) => {
                                const file = e?.target?.files?.[0];

                                if (!file) {
                                  return;
                                }

                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === "string") {
                                    resolve(
                                      `data:${file.type};base64,${btoa(reader.result)}`
                                    );
                                  } else {
                                    reject(
                                      new Error(
                                        "File reading did not result in a string."
                                      )
                                    );
                                  }
                                };
                                reader.onerror = reject;
                                reader.readAsBinaryString(file);
                              });
                            }

                            const newImage = await readFileAsync();
                            onChange(newImage);
                          }}
                        />
                        <FuseSvgIcon className="text-white">
                          heroicons-outline:camera
                        </FuseSvgIcon>
                      </label>
                    </div>
                    <div>
                      <IconButton
                        onClick={() => {
                          onChange("");
                        }}
                      >
                        <FuseSvgIcon className="text-white">
                          heroicons-solid:trash
                        </FuseSvgIcon>
                      </IconButton>
                    </div>
                  </div>
                  <Avatar
                    sx={{
                      backgroundColor: "background.default",
                      color: "text.secondary",
                    }}
                    className="object-cover w-full h-full text-64 font-bold"
                    src={value}
                    alt={name}
                  >
                    {name?.charAt(0)}
                  </Avatar>
                </Box>
              )}
            />
          </div>
        </div> */}

<div className="sm:col-span-2 text-sm">
          <Typography
            className="text-start mt-1 mb-[-20px]"
            style={{ fontSize: "12px", fontWeight: "800" }}
          >
            Country Location
          </Typography>
          <Controller
            control={control}
            // name={`officeCountry`}
            name="officeCountry"
            className="mt-0.5"
            render={({ field }) => (
              <Select
              sx={{
                "& .MuiSelect-select": {
                  minHeight: "0!important",
                },
              }}
                className="mt-16"
                {...field}
                id="officeCountry"
                label="Country of posting"
                placeholder="Country of posting"
                variant="outlined"
                fullWidth
                error={!!errors.officeCountry}
                helperText={errors?.officeCountry?.message}
              >
                <MenuItem value="">
                  <em>Select a country</em>
                </MenuItem>

                {countries?.data?.data?.map((cnty, index) => (
                  <MenuItem key={index} value={cnty._id}>{cnty.name}</MenuItem>
                ))}
              </Select>
            )}
          />
        </div>

        <div className="sm:col-span-2 text-sm">
            <Typography
              className="text-start mt-10  mb-[-30px]"
              style={{ fontSize: "12px", fontWeight: "800" }}
            >
              State Location
            </Typography>
            <Controller
              control={control}
              // name={`officeState`}
              name="officeState"
              render={({ field }) => (
                <Select
                  className="mt-32"
                  {...field}
                  id="officeState"
                  label="State of posting"
                  placeholder="State of posting"
                  variant="outlined"
                  fullWidth
                  error={!!errors.officeState}
                  helperText={errors?.officeState?.message}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>

                  {bstates?.map((bsts, index) => (
                    <MenuItem key={index} value={bsts._id}>{bsts.name}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </div>
       

          <div className="sm:col-span-2 text-sm">
            <Typography
              className="text-start mt-10  mb-[-30px]"
              style={{ fontSize: "12px", fontWeight: "800" }}
            >
              L.G.A|Country Location
            </Typography>
            <Controller
              control={control}
              // name={`officeLga`}
              name="officeLga"
              render={({ field }) => (
                <Select
                  className="mt-32"
                  {...field}
                  id="officeLga"
                  label="L.G.A of posting"
                  placeholder="L.G.A of posting"
                  variant="outlined"
                  fullWidth
                  error={!!errors.officeLga}
                  helperText={errors?.officeLga?.message}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>

                  {blgas?.map((blg, index) => (
                    <MenuItem key={index} value={blg._id}>{blg.name}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </div>
        {/* )} */}

        {/* {getValues()?.officeLga && (
          <>
            <Typography 
               className="text-start"
            style={{ fontSize: "12px", fontWeight: "800" }}>Office Location</Typography>
            <Controller
              control={control}
              name={`officeDesignate`}
              render={({ field }) => (
                <Select
                  className="mt-32"
                  {...field}
                  id="officeDesignate"
                  label="Office of posting"
                  placeholder="Office of posting"
                  variant="outlined"
                  fullWidth
                  error={!!errors.officeDesignate}
                  helperText={errors?.officeDesignate?.message}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>

                  {lgasOffices?.map((office) => (
                    <MenuItem value={office._id}>{office.name}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </>
        )} */}

        <>
          <Typography
           className="text-start mt-10  mb-[-30px]"
            style={{ fontSize: "12px", fontWeight: "800" }}
          >
            Department
          </Typography>
          <Controller
            control={control}
            name={`department`}
            render={({ field }) => (
              <Select
                className="mt-32"
                {...field}
                id="department"
                label="Department"
                placeholder="Department"
                variant="outlined"
                fullWidth
                error={!!errors.department}
                helperText={errors?.department?.message}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {departments?.data?.data?.map((dt) => (
                  <MenuItem value={dt._id}>{dt.name}</MenuItem>
                ))}
              </Select>
            )}
          />
        </>

        {getValues()?.department && (
          <>
            <Typography
             className="text-start mt-10  mb-[-30px]"
              style={{ fontSize: "12px", fontWeight: "800" }}
            >
              Designation
            </Typography>
            <Controller
              control={control}
              name={`designation`}
              render={({ field }) => (
                <Select
                  className="mt-32"
                  {...field}
                  id="designation"
                  label="Designation"
                  placeholder="Designation"
                  variant="outlined"
                  fullWidth
                  error={!!errors.designation}
                  helperText={errors?.designation?.message}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>

                  {designationsList?.map((desig) => (
                    <MenuItem value={desig._id}>{desig.name}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </>
        )}

        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="Name"
              placeholder="Name"
              id="name"
              error={!!errors.name}
              helperText={errors?.name?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:user-circle
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <>
          <Typography
           className="text-start mt-10  mb-[-30px]"
            style={{ fontSize: "12px", fontWeight: "800" }}
          >
            Gender
          </Typography>
          <Controller
            control={control}
            name={`gender`}
            render={({ field }) => (
              <Select
                className="mt-32"
                {...field}
                id="gender"
                label="Gender"
                placeholder="Gender"
                variant="outlined"
                fullWidth
                error={!!errors.gender}
                helperText={errors?.gender?.message}
                value={getValues()?.gender}
                // getValues()?.officeCountry
              >
                <MenuItem value="">
                  <em>Select a gender</em>
                </MenuItem>

                <MenuItem value={`MALE`}>MALE</MenuItem>
                <MenuItem value={`FEMALE`}>FEMALE</MenuItem>
              </Select>
            )}
          />
        </>

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="Email"
              placeholder="Email"
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors?.email?.message}
              disabled={contactId !== "new" && true}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="Address"
              placeholder="Address"
              id="address"
              error={!!errors.address}
              helperText={errors?.address?.message}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:location-marker
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="birthday"
          render={({ field: { value, onChange } }) => (
            <DateTimePicker
              value={new Date(value)}
              onChange={(val) => {
                onChange(val?.toISOString());
              }}
              className="mt-32 mb-16 w-full"
              slotProps={{
                textField: {
                  id: "birthday",
                  label: "Birthday",
                  InputLabelProps: {
                    shrink: true,
                  },
                  fullWidth: true,
                  variant: "outlined",
                  error: !!errors.birthday,
                  helperText: errors?.birthday?.message,
                },
                actionBar: {
                  actions: ["clear", "today"],
                },
              }}
              slots={{
                openPickerIcon: BirtdayIcon,
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone"
              placeholder="Phone"
              variant="outlined"
              fullWidth
              error={!!errors.phone}
              helperText={errors?.phone?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>
      <Box
        className="flex items-center justify-between mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
        sx={{ backgroundColor: "background.default" }}
      >
        <Button className="bg-red-400 hover:bg-red-800" 
        onClick={() => handleRemoveAdmin(admin?.data?._id)}
        >
          Delete This Account
        </Button>

        <div>
        <Button className="ml-auto" onClick={() => history.back()}>
          Cancel
        </Button>
        {contactId === "new" && (
          <Button
            className="ml-8"
            variant="contained"
            color="secondary"
            disabled={
              _.isEmpty(dirtyFields) || !isValid || recruitStaff?.isLoading
            }
            onClick={handleSubmit(onSubmit)}
          >
            Recruit staff
          </Button>
        )}

        {contactId !== "new" && (
          <Button
            className="ml-8"
            variant="contained"
            color="secondary"
            disabled={
              _.isEmpty(dirtyFields) || !isValid || updateStaffInfo?.isLoading
            }

            onClick={handleSubmit(onUpdate)}
          >
            update staff
          </Button>
        )}
        </div>
      </Box>
    </>
  );
}

export default AddStaffContactForm;
