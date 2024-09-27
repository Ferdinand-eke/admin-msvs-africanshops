// import useCountries from '@/hooks/useCountries'
import React from 'react'
import Select from 'react-select'
// import useCountries from '../../apphooks/useCountries'
// import useSellerCountries from 'app/configs/data/server-calls/countries/useCountries'
import { City } from 'country-state-city'


const LgaSelect = ({ value, onChange, 
    // blgas
    countryCode,
    stateCode
 }) => {

    return (
        <div>
              <label
                                style={{ fontSize: '12px', fontWeight: '800' }}>
                                *Shop/Business LGA/County Origin
                            </label>
            <Select
                placeholder="What LGA/County are you in?"
                isClearable
                // options={blgas}
                options={City.getCitiesOfState(countryCode, stateCode)}
                value={value}
                onChange={(value) => onChange(value )}
                formatOptionLabel={(option) => (
                    <div className="flex flex-row items-center gap-3">
                    
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
                    borderRadius:6,
                    colors
                    : {
                        ...theme.colors,
                        primary: 'black',
                        primary25: '#ffe4e6'
                    }
                })}
            />
        </div>
    )
}

export default LgaSelect
