import "./style.css"
import React, { useEffect, useState } from "react"
import image_doll from "../../assets/images/buttons/doll.png"
import image_lock from "../../assets/images/buttons/lock.png"
import image_camera from "../../assets/images/buttons/camera.png"
import image_noPhoto from "../../assets/images/no_photo.png"

const Input = ({type, name, description, planceHolder, value, maxLength, disabled, require, accept, pathPhoto, image, typeImage, onSelect,
  onChange}) => {  

  const hiddenFileInput = React.useRef(null);

  const handleClickFileInput = event => {
    hiddenFileInput.current.click();
  };  

  const [required, setRequired] = useState("")
  const [colorFocu, setColorFocu] = useState("bodyUnFocu_Input")

  useEffect(() => {
    if (String(value) !== "") setRequired("noRequired_Input")
    else
    {        
      if (require){
        if (String(value) !== "") setRequired("noRequired_Input")
        else setRequired("required_Input")
      } else setRequired("noRequired_Input")
    }
  }, [require, value])

  function handleBlur(event) {
    if (event.target.value === "") {
      if (require) setRequired("required_Input"); else setRequired("noRequired_Input")
    } else setRequired("noRequired_Input")

    setColorFocu("bodyUnFocu_Input")
  }

  function handleFocu(){
    setColorFocu("bodyFocu_Input")
    onSelect(name)
  }

  return(
    <>
      {/* Não for File */}
      { type !== "file" &&
        <div id="Input">
          { description &&
            <div id="description_Input">
              <label>{description}</label>
            </div>
          }

          <div id={colorFocu}>
            { image &&
              <>
                { (typeImage === 1) && 
                  <div className="bodyImage_Input">
                    <img src={image_doll} alt="Boneco" style={{ width: 26, height: 26 }} /> 
                  </div>
                }

                { (typeImage === 2) && 
                  <div className="bodyImage_Input">
                    <img src={image_lock} alt="Cadeado" style={{ width: 26, height: 26 }} /> 
                  </div>
                }

                <div id="bodyFieldImage_Input">
                  <input
                    type={type}
                    id={name}
                    name={name}   
                    className={required}
                    placeholder={planceHolder}
                    value={value}
                    maxLength={maxLength}
                    disabled={disabled}
                    onBlur={handleBlur}
                    onFocus={handleFocu}
                    onChange={onChange} />
                </div>
              </>
            }

            { !image &&
              <>
                <div id="bodyFieldNoImage_Input">
                  <input
                    type={type}
                    id={name}
                    name={name}
                    className={required}
                    placeholder={planceHolder}
                    value={value}
                    maxLength={maxLength}
                    disabled={disabled}
                    onBlur={handleBlur}
                    onFocus={handleFocu}
                    onChange={onChange} />
                </div>
              </>
            }
          </div>
        </div>
      }

      {/* File */}
      { type === "file" &&
        <>
          <input
            className="file_Input"
            type={type}
            ref={hiddenFileInput}
            id={name}
            name={name}
            maxLength={maxLength}
            accept={accept}
            disabled={disabled}
            value={value}
            onChange={onChange} />

          <div id="input_Input">
            <div>
              { ((pathPhoto ===  null) || (pathPhoto ===  "")) && <img src={image_noPhoto} className="foto_Input" alt="Sem foto" onClick={handleClickFileInput} /> }
              { ((pathPhoto !== null) && (pathPhoto !== "")) && <img src={pathPhoto} className="foto_Input" alt="Foto" onClick={handleClickFileInput} /> }
            </div>
            <div id="containerCamera_Input">
              <img src={image_camera} id="camera_Input" alt="Camera" onClick={handleClickFileInput}/>
            </div>
          </div>
        </>
      }
    </>
  )
}

export default Input