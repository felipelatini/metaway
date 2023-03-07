import "./style.css"
import React, { useEffect, useState } from "react"

const Select = ({name, description, value, disabled, require, options, onSelect, set}) => {
  const [obrigatorio, setObrigatorio] = useState("")
  const [colorFocu, setColorFocu] = useState("corpoUnFocu_Select")

  useEffect(() => {
    if (String(value) !== "0"){
      setObrigatorio("naoObrigatorio_Select")
    }
    else
    {
      if (require){
        if (String(value) !== "0") setObrigatorio("naoObrigatorio_Select")
        else setObrigatorio("obrigatorio_Select")
      } else setObrigatorio("naoObrigatorio_Select")
    }
  }, [require, value])

  function handleChange(event){
    set(event.target.value)

    if (event.target.value === "0")
    {
      if (require) setObrigatorio("obrigatorio_Select");
      else setObrigatorio("naoObrigatorio_Select")
    } else setObrigatorio("naoObrigatorio_Select")
  }

  function handleBlur(){
    setColorFocu("corpoUnFocu_Select")    
  }

  function handleFocu(){
    setColorFocu("corpoFocu_Select")
    onSelect(name)
  }  

  return(
    <div id="Select">
      { description &&
        <div id="descricao_Select">
          <label>{description}</label>
        </div>
      }

      <div id={colorFocu}>
        <div id="corpoCampoSemImagem_Select">
          <select
            id={name}
            className={obrigatorio}
            value={value}
            disabled={disabled}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocu} >

            {options.RESULTADO.map((index) => (
            <option key={"opt"+ name + index.ID} value={index.ID}>{index.VALOR}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default Select