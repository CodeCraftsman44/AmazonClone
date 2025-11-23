import { useFormContext } from 'react-hook-form';
import { Box, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, TextField } from "@mui/material";
import JsonInputComponent from './jsonInputComponent';

const StepJsonComponents = ({ formConfig, fieldType }) => {
    const { register } = useFormContext();
    const jsonFields = formConfig.data.json;
    return (
        <Box>
            {jsonFields.map((field, index) => (
                <JsonInputComponent key={field.name} fields={field} />
            ))
            }
        </Box>
    )
}
export default StepJsonComponents;
