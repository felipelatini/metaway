import "./style.css"
import React, { useEffect, useState } from "react"
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import pt from "date-fns/locale/pt"

const DateTimePicker = ({name, description, planceHolder, value, require, onSelect, onChange, interval, initial, startDate, endDate}) => {
  registerLocale("pt", pt)

  const [required, setRequired] = useState("")
  const [colorFocu, setColorFocu] = useState("bodyUnFocu_DatePicker")

  useEffect(() => {
    if (String(value) !== "") setRequired("noRequired_DatePicker")
    else
    {        
      if (require){
        if (String(value) !== "") setRequired("noRequired_DatePicker")
        else setRequired("required_DatePicker")
      } else setRequired("noRequired_DatePicker")
    }
  }, [require, value])

  function handleBlur(event) {
    if (event.target.value === "") {
      if (require) setRequired("required_DatePicker"); else setRequired("noRequired_DatePicker")
    } else setRequired("noRequired_DatePicker")

    setColorFocu("bodyUnFocu_DatePicker")    
  }

  function handleFocu(){
    setColorFocu("bodyFocu_DatePicker")
    onSelect(name)
  }

  return(
    <div id="datePicker">
            
      { description &&
        <div id="description_DatePicker">
          <label>{description}</label>
        </div>
      }

      <div id={colorFocu}>
        <>
          <div id="bodyField_DatePicker">
            { !interval &&
              <DatePicker
                id={name}
                name={name}
                className={required}
                planceHolder={planceHolder}
                selected={value}
                onChange={(date) => onChange(date)} 
                onBlur={handleBlur}
                onFocus={handleFocu}
                locale="pt" 
                dateFormat="dd/MM/yyyy" />
            }

            { interval &&
              <>
                { initial &&
                  <>
                    <DatePicker
                      id={name}
                      name={name}
                      className={required}
                      planceHolder={planceHolder}
                      selected={value}
                      onChange={(date) => onChange(date)} 
                      onBlur={handleBlur}
                      onFocus={handleFocu}
                      locale="pt"
                      dateFormat="dd/MM/yyyy"
                      selectsStart
                      startDate={value}
                      endDate={endDate} />
                </>
                }

                { !initial &&
                  <>
                    <DatePicker
                      id={name}
                      name={name}
                      className={required}
                      planceHolder={planceHolder}
                      selected={value}
                      onChange={(date) => onChange(date)} 
                      onBlur={handleBlur}
                      onFocus={handleFocu}
                      locale="pt"
                      dateFormat="dd/MM/yyyy"
                      selectsEnd
                      startDate={startDate}
                      endDate={value}
                      minDate={startDate} />
                  </>
                }            
              </>
            }
          </div>
        </>
      </div>
    </div>
  )
}

export default DateTimePicker