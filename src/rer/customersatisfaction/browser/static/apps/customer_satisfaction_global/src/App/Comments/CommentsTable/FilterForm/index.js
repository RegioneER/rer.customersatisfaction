import {useContext} from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

import {FilterContext} from '../Context';

const FilterForm = ({}) => {
  const filtersContext = useContext(FilterContext);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="site-select-label">Sito</InputLabel>
        <Select
          labelId="site-select-label"
          id="demo-simple-select"
          value={filtersContext.filters.siteId.value || ""}
          label="Age"
          onChange={(event) => {
            filtersContext.setFilters(oldFilters => (
              {...oldFilters, siteId: {...oldFilters.siteId, value:event.target.value}})
              )
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {filtersContext.filters.siteId.possibleValues.map((item) => {
            return (<MenuItem key={item} value={item}>{item}</MenuItem>)
          })}
        </Select>
      </FormControl>
    </Box>
  )
}

export default FilterForm;
