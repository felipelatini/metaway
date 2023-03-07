import "./style.css"
import React, { useEffect, useState } from "react"
import InputMask from "react-input-mask";
import image_delete from "../../assets/images/buttons/delete.png"
import image_doll from "../../assets/images/buttons/doll.png"
import image_lock from "../../assets/images/buttons/lock.png"
import image_search from "../../assets/images/buttons/search.png"

const InputMasked = ({name, description, planceHolder, mask, value, disabled, require, image, typeImage, 
  setSearch, setClean, onSelect, onChange}) => {

  const [required, setRequired] = useState("")
  const [colorFocu, setColorFocu] = useState("bodyUnFocu_InputMasked")

  useEffect(() => {
    if (String(value) !== "") setRequired("noRequired_InputMasked")
    else
    {
      if (require){
        if (String(value) !== "") setRequired("noRequired_InputMasked")
        else setRequired("required_InputMasked")
      } else setRequired("noRequired_InputMasked")
    }
  }, [require, value])

  function handleBlur(event) {
    if (event.target.value === "") {
      if (require) setRequired("required_InputMasked"); else setRequired("noRequired_InputMasked")        
    } else setRequired("noRequired_InputMasked")

    setColorFocu("bodyUnFocu_InputMasked")        
  }

  function handleFocu(){
    setColorFocu("bodyFocu_InputMasked")
    onSelect(name)
  }

  return(
    <div id="InputMasked">
      { description &&
        <div id="description_InputMasked">
        <label>{description}</label>
        </div>
      }

      <div id={colorFocu}>
        { image &&
          <>
            { (typeImage === 1) && 
              <div className="bodyImage_InputMasked">
                <img src={image_doll} alt="Boneco" style={{ width: 23, height: 30 }} /> 
              </div>
            }

            { (typeImage === 2) && 
              <div className="bodyImage_InputMasked">
                <img src={image_lock} alt="Cadeado" /> 
              </div>
            }

            <div id="bodyFieldImage_InputMasked">
              <InputMask
                InputMask
                id={name}
                name={name}
                className={required}
                placeholder={planceHolder}
                mask={mask}
                value={value}
                disabled={disabled}
                onBlur={handleBlur}
                onFocus={handleFocu}
                onChange={onChange} />
            </div>

            { (typeImage === 3) && 
              <div className="bodyImage_InputMasked marginRight10_InputMasked">
                <div className="marginRight10_InputMasked" onClick={() => setSearch()} >
                  <img src={image_search} alt="Pesquisar" style={{ height: 30, width: 30 }} /> 
                </div>
                <div onClick={() => setClean()}>
                  <img src={image_delete} alt="Limpar" style={{ height: 30, width: 30 }} /> 
                </div>
              </div>
            }
          </>
        }

        { !image &&
          <>
            <div id="bodyFieldNoImage_InputMasked">
              <InputMask
                id={name}
                name={name}
                className={required}
                placeholder={planceHolder}
                mask={mask}
                value={value}
                disabled={disabled}
                onBlur={handleBlur}
                onFocus={handleFocu}                  
                onChange={onChange} />                    
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default InputMasked