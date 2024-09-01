import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { InputAdornment, MenuItem, Select, Typography } from '@mui/material';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;
	return (
		<div>
			<Controller
				name="plansname"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="Plan Name"
						autoFocus
						id="plansname"
						variant="outlined"
						fullWidth
						error={!!errors.plansname}
						helperText={errors?.plansname?.message}
					/>
				)}
			/>

<Controller
				name="price"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="Price for product storage / month"
						autoFocus
						id="price"
						variant="outlined"
						fullWidth
						error={!!errors.price}
						helperText={errors?.price?.message}
					/>
				)}
			/>

<Typography  style={{ fontSize: "12px", fontWeight: "800" }}>Does this plan has support incorporated?</Typography>
<Controller
        name="support"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="support"
            label="Support Incorporation"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.support}
            helpertext={errors?.support?.message}
          >
            <MenuItem value="">Select a support status</MenuItem>
                <MenuItem 
				 value={'Inclusive'}>
                  Inclusive
                </MenuItem>

				<MenuItem 
				 value={'Non Inclusive'}>
                  Non Inclusive
                </MenuItem>
       
          </Select>
        )}
      />

<Typography style={{ fontSize: "12px", fontWeight: "800" }}>Does this plan have ads boost?</Typography>
<Controller
        name="adsbost"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="adsbost"
            label="Ads Boost Incorporation"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.adsbost}
            helpertext={errors?.adsbost?.message}
          >
            <MenuItem value="">Select an ads boost status</MenuItem>
                <MenuItem 
				 value={'Inclusive'}>
                  Inclusive
                </MenuItem>

				<MenuItem 
				 value={'Non Inclusive'}>
                  Non Inclusive
                </MenuItem>
       
          </Select>
        )}
      />


<Typography style={{ fontSize: "12px", fontWeight: "800" }}>Does this plan have an analytican dashboard?</Typography>
<Controller
        name="dashboardandanalytics"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="dashboardandanalytics"
            label="Analytican Dashboard Incorporation"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.dashboardandanalytics}
            helpertext={errors?.dashboardandanalytics?.message}
          >
            <MenuItem value="">Select an ads boost status</MenuItem>
                <MenuItem 
				 value={'Inclusive'}>
                  Inclusive
                </MenuItem>

				<MenuItem 
				 value={'Non Inclusive'}>
                  Non Inclusive
                </MenuItem>
       
          </Select>
        )}
      />


<Controller
				name="numberofproducts"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="*Number of Products Uploadable on every 10 sales"
						autoFocus
						id="numberofproducts"
						variant="outlined"
						fullWidth
						error={!!errors.numberofproducts}
						helperText={errors?.numberofproducts?.message}
					/>
				)}
			/>

<Controller
				name="numberoffeaturedimages"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="*Number of Products Images Uploadable"
						autoFocus
						id="numberoffeaturedimages"
						variant="outlined"
						fullWidth
						error={!!errors.numberoffeaturedimages}
						helperText={errors?.numberoffeaturedimages?.message}
					/>
				)}
			/>

<Controller
				name="percetageCommissionCharge"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						label=" *Percentage Commission Charge (in %)"
						id="percetageCommissionCharge"
						InputProps={{
							startAdornment: <InputAdornment position="start">%</InputAdornment>
						}}
						type="number"
						variant="outlined"
						autoFocus
						fullWidth
					/>
				)}
			/>

<Controller
				name="percetageCommissionChargeConversion"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						label="*Conversion of Percentage Commission Charge"
						id="percetageCommissionChargeConversion"
						// InputProps={{
						// 	startAdornment: <InputAdornment position="start">%</InputAdornment>
						// }}
						type="number"
						variant="outlined"
						autoFocus
						fullWidth
						disabled
					/>
				)}
			/>

		
		</div>
	);
}

export default BasicInfoTab;
