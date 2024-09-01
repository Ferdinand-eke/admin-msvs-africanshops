import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";
import { MenuItem, Select, Typography } from "@mui/material";

/**
 * The basic info tab.
 */
function BasicInfoTab() {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;
  return (
    <div>
    
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

      <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Are we operational in this country?
        </Typography>
        <Controller
          name="isInOperation"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
              className="mt-8 mb-16"
              id="isInOperation"
              label="Operational Status"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.isInOperation}
              helpertext={errors?.isInOperation?.message}
            >
              <MenuItem value="">Select an operations status</MenuItem>
              <MenuItem value={false}>Not Operational</MenuItem>

              <MenuItem value={true}>Operational</MenuItem>
            </Select>
          )}
        />
      </>

      <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Publish this country?
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
              <MenuItem value={false}>Not Published</MenuItem>

              <MenuItem value={true}>Published</MenuItem>
            </Select>
          )}
        />
      </>

      <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Feature this country?
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
              <MenuItem value={false}>Not Featured</MenuItem>

              <MenuItem value={true}>Featured</MenuItem>
            </Select>
          )}
        />
      </>
    </div>
  );
}

export default BasicInfoTab;
