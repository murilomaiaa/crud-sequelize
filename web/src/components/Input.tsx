import { useRef, useEffect } from 'react'
import { useField } from '@unform/core'

import {
  FormControl,
  FormControlProps,
  FormLabel,
  Input as CInput,
  InputProps,
  Text
} from '@chakra-ui/react'

interface Props extends InputProps {
  name: string
  formControlProps?: FormControlProps
  label?: string
}

const Input = ({ name, formControlProps, isDisabled, label, ...rest }: Props) => {
  const inputRef = useRef(null)

  const { fieldName, registerField, defaultValue, error } = useField(name)
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value'
    })
  }, [fieldName, registerField])

  return (
    <FormControl
      isInvalid={!!error}
      isDisabled={isDisabled}
      {...formControlProps}
    >
      {!!label && (<FormLabel htmlFor={fieldName}>{label}</FormLabel>)}
      <CInput
        type="text"
        defaultValue={defaultValue}
        id={fieldName}
        ref={inputRef}
        {...rest}
      />
      <Text mt={1} color="red.400" size="sm">{error}</Text>
    </FormControl>
  )
}

export { Input }
