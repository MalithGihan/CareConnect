import { validateEmail, validatePassword, validateString } from "../ValidationConsraints"

export const validateInput = (inputId, inputValue) => {
    if(inputId === "userName"){
        return validateString(inputId,inputValue)
    } else if (inputId==="email"){
        return validateEmail(inputId,inputValue)
    }else if (inputId === "password" || inputId === "passwordConfirm"){
        return validatePassword(inputId,inputValue)
    }else if (inputId === "role" || inputId === "fullName" || inputId === "phoneNumber" || inputId === "address" ||inputId === "nic" ||inputId === "dateOfBrirth" ||inputId === "education" ||inputId === "hospital" || inputId === "jobStart"){
        return validateString(inputId,inputValue)
    }
}