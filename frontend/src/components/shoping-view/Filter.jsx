import { filterOptions } from "../../config/index";
import { Fragment } from "react";
import {
  FormControlLabel,
  Checkbox,
  Divider,
  Typography,
  Paper,
} from "@mui/material";

function ProductFilter({ filters, handleFilter }) {
  return (
    <Paper elevation={2}>
      <div style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
        <Typography variant="h6" fontWeight="bold">
          Filters
        </Typography>
      </div>
      <div style={{ padding: "16px" }}>
        {Object.keys(filterOptions).map((keyItem, index) => (
          <Fragment key={keyItem}>
            <div>
              <Typography variant="subtitle1" fontWeight="bold">
                {keyItem}
              </Typography>
              <div style={{ marginTop: "8px" }}>
                {filterOptions[keyItem].map((option) => (
                  <FormControlLabel
                    key={option.id}
                    control={
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) > -1
                        }
                        onChange={() => handleFilter(keyItem, option.id)}
                      />
                    }
                    label={option.label}
                  />
                ))}
              </div>
            </div>
            {index !== Object.keys(filterOptions).length - 1 && (
              <Divider style={{ margin: "16px 0" }} />
            )}
          </Fragment>
        ))}
      </div>
    </Paper>
  );
}

export default ProductFilter;
