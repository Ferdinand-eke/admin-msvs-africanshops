import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import useCountries from 'src/app/api/countries/useCountries';
import { InputAdornment, MenuItem, Select, Typography } from '@mui/material';
import useHubs from 'src/app/api/tradehubs/useTradeHubs';
import useShopplans from 'src/app/api/shopplans/useShopPlans';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	// const { data:countries, isLoading:countriesLoading, refetch } = useCountries();
	const { data: hubs, isLoading, refetch } = useHubs();
	const { data: plans } = useShopplans();
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	return (
		<div>

<>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Trading hub operation
        </Typography>
        <Controller
          name="tradehub"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
            //   disabled
              className="mt-8 mb-16"
              id="tradehub"
              label="Trading Hub"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.tradehub}
              helpertext={errors?.tradehub?.message}
            >
              <MenuItem value="">Select a trading hub</MenuItem>
              {hubs?.data?.tradehubs &&
                hubs?.data?.tradehubs?.map((option, id) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.hubname}
                  </MenuItem>
                ))}
            </Select>
          )}
        />
      </>

	  <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Plan Type
        </Typography>
        <Controller
          name="planType"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
            //   disabled
              className="mt-8 mb-16"
              id="planType"
              label="Shop Plan on which this unit runs"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.planType}
              helpertext={errors?.planType?.message}
            >
              <MenuItem value="">Select a plan on which this unit runs</MenuItem>
              {plans?.data?.merchantPlans &&
                plans?.data?.merchantPlans?.map((option, id) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.plansname}
                  </MenuItem>
                ))}
            </Select>
          )}
        />
      </>

	  

			<Controller
				name="unitname"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="Name"
						autoFocus
						id="unitname"
						variant="outlined"
						fullWidth
						error={!!errors.unitname}
						helperText={errors?.unitname?.message}
					/>
				)}
			/>



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


<Controller
				name="leastPermissibleCount"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						label="Least permissible amount for this unit "
						id="leastPermissibleCount"
						InputProps={{
							startAdornment: <InputAdornment position="start">Amount</InputAdornment>
						}}
						type="number"
						variant="outlined"
						autoFocus
						fullWidth
					/>
				)}
			/>
		</div>
	);
}

export default BasicInfoTab;
