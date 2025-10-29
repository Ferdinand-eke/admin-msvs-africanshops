import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import useCountries from 'src/app/api/countries/useCountries';
import { MenuItem, Select, Typography } from '@mui/material';
import { useGetDepartments } from 'src/app/api/departments/useDepartments';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	// const { data:countries, isLoading:countriesLoading, refetch } = useCountries();
	const { data:departments, 
		// isLoading:departmentsLoading, refetch
	 } = useGetDepartments();
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	return (
		<div>

<>
<Typography style={{ fontSize: "12px", fontWeight: "800" }}>
Department of this designation
        </Typography>
<Controller
        name="department"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="department"
            label="Department of this designation"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.department}
            helpertext={errors?.department?.message}
          >
            <MenuItem value="">Select a department</MenuItem>
            {departments?.data?.departments &&
              departments?.data?.departments?.map((option, id) => (
                <MenuItem key={option.id || option._id} value={option.id || option._id}>
                  {option.name}
                </MenuItem>
              ))}
          </Select>
        )}
      />
</>

			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="Name"
						autoFocus
						id="name"
						variant="outlined"
						fullWidth
						error={!!errors.name}
						helperText={errors?.name?.message}
					/>
				)}
			/>

{/* <Controller
        name="isPublished"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="isPublished"
            label="Operational Status"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.isPublished}
            helpertext={errors?.isPublished?.message}
          >
            <MenuItem value="">Select a publish status</MenuItem>
                <MenuItem 
				 value={false}>
                  Not Published
                </MenuItem>

				<MenuItem 
				 value={true}>
                  Published
                </MenuItem>
       
          </Select>
        )}
      />

<Controller
        name="isFeatured"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="isFeatured"
            label="Operational Status"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.isFeatured}
            helpertext={errors?.isFeatured?.message}
          >
            <MenuItem value="">Select an fetaured status</MenuItem>
                <MenuItem 
				 value={false}>
                  Not Featured
                </MenuItem>

				<MenuItem 
				 value={true}>
                  Featured
                </MenuItem>
       
          </Select>
        )}
      /> */}


<>
<Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Publish?
        </Typography>
<Controller
        name="isPublished"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="isPublished"
            label="Operational Status"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.isPublished}
            helpertext={errors?.isPublished?.message}
          >
            <MenuItem value="">Select a publish status</MenuItem>
                <MenuItem 
				 value={false}>
                  Not Published
                </MenuItem>

				<MenuItem 
				 value={true}>
                  Published
                </MenuItem>
       
          </Select>
        )}
      />
</>


<>
<Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Featured?
        </Typography>
<Controller
        name="isFeatured"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="isFeatured"
            label="Operational Status"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.isFeatured}
            helpertext={errors?.isFeatured?.message}
          >
            <MenuItem value="">Select an fetaured status</MenuItem>
                <MenuItem 
				 value={false}>
                  Not Featured
                </MenuItem>

				<MenuItem 
				 value={true}>
                  Featured
                </MenuItem>
       
          </Select>
        )}
      />
</>
		</div>
	);
}

export default BasicInfoTab;
