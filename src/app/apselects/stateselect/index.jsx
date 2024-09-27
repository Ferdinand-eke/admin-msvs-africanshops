// import useCountries from '@/hooks/useCountries'
import React from "react";
import Select from "react-select";
import useCountries from "../../apphooks/useCountries";
import { Country, State, City } from "country-state-city";
// import useSellerCountries from 'app/configs/data/server-calls/countries/useCountries'

// export type StateSelectValue = {
//     flag: string;
//     label: string;
//     latlng: number[];
//     region: string;
//     value: string;
// }

// interface StateSelectProps {
//     value?: CountrySelectValue
//     onChange: (value: CountrySelectValue) => void
// }

const StateSelect = ({ value, onChange, countryCode }) => {
  return (
    <div>
      <label style={{ fontSize: "12px", fontWeight: "800" }}>
        *Shop/Business State Origin
      </label>
      <Select
        placeholder="What state are you in?"
        isClearable
        options={State.getStatesOfCountry(countryCode)}
        value={value}
        onChange={(value) => onChange(value)}
        formatOptionLabel={(option) => (
          <div className="flex flex-row items-center gap-3">
            {/* <div> */}
            {/* <image 
                        src={option?.flag}
                      
                        className='height-[10px] width-[14px]'
                        /> */}
            {/* </div> */}
            <div>
              {option?.name}
              {/* <span className='text-neutral-800 ml-1'>
                                {option.region}
                            </span> */}
            </div>
          </div>
        )}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#ffe4e6",
          },
        })}
      />
    </div>
  );
};

export default StateSelect;
