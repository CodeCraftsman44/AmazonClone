import { useFormContext } from 'react-hook-form';
import { Box, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, TextField } from "@mui/material";

const StepTextComponents = ({ formConfig, fieldType }) => {
    const { register, formState: { errors } } = useFormContext();
    const textFields = formConfig.data.text;
    return (
        <Box>
            {textFields.map((field, index) => (
                <FormControl fullWidth margin="normal" key={field.name}>

                    <TextField
                        fullWidth
                        margin='normal'
                        key={field.name}
                        label={field.label}
                        error={!!errors[field.name]}
                        {...register(field.name, { required: field.required })}
                        defaultValue={field.default || ''}
                        placeholder={field.placeholder || ''}

                    />
                </FormControl>
            ))}
        </Box>
    )
}
export default StepTextComponents;


