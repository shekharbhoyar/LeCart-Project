import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <TextField
            fullWidth
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            variant="outlined"
          />
        );
        break;

      case "select":
        element = (
          <FormControl fullWidth variant="outlined">
            <InputLabel>{getControlItem.label}</InputLabel>
            <Select
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              label={getControlItem.label}
            >
              {getControlItem.options?.map((optionItem) => (
                <MenuItem key={optionItem.id} value={optionItem.id}>
                  {optionItem.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        break;

      case "textarea":
        element = (
          <TextField
            fullWidth
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            multiline
            rows={4}
            variant="outlined"
          />
        );
        break;

      default:
        element = (
          <TextField
            fullWidth
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            variant="outlined"
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <label className="mb-1 font-medium">{controlItem.label}</label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button
        variant="contained"
        color="primary"
        disabled={isBtnDisabled}
        type="submit"
        fullWidth
        sx={{ mt: 2 }}
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
