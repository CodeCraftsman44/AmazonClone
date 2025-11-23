import { useFormContext } from 'react-hook-form';
import { Box, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, TextField, Alert } from "@mui/material";
const StepFileComponents = ({ formConfig }) => {
    const { register, setValue, formState: { errors } } = useFormContext();
    const fileFields = formConfig?.data?.file ?? [];
    return (
        <Box>
            {fileFields?.map((field, index) => (
                <Box key={field.name || `file-${index}`}>
                    <Box component={"div"} className='fileInput'>
                        <label htmlFor={field.name}>{field.label}</label>
                        <input
                            id={field.name}
                            type="file"
                            {...register(field.name, { required: field.required })}
                        />
                    </Box>
                    {!!errors[field.name] && (
                        <Alert variant='outlined' severity='error'>
                            This field is required
                        </Alert>
                    )}
                </Box>
            ))}
        </Box>
    )
}
export default StepFileComponents;
