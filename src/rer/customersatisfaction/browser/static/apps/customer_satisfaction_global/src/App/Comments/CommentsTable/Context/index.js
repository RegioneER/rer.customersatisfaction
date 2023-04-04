import {createContext} from 'react';

const FilterContext = createContext({});
const FilterContextProvider = FilterContext.Provider;


export {
  FilterContextProvider,
  FilterContext,
};
