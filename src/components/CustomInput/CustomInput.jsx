import { Box, InputAdornment, TextField } from '@mui/material';
import { eyes, eyeSee } from '../../assets';
import React, { forwardRef, useState } from 'react';
import './customInput.scss'

const CustomInput = forwardRef((props, ref) => {
  const {
    starticon = null,
    endicon = null,
    valid = true,
    ishavingpwicon = false,
    inputShrink = true,
    novalidate = false,
    size = 'medium',
    isGapEndIcon = false,
    inputClassName = '',
    minRows = 3,
    maxRows = 3,
    hideFieldset = false,
    isRequired = false,
    inputComponentProps = null,
    ...validTextAttributes
  } = props;
  const { type, className, label, disabled = false } = validTextAttributes;
  const [isShowPassword, setIsShowPassword] = useState(false);
  const isMultiline = type === 'textarea';
  const requiredLabel = isRequired ? (
    <span>
      {label} <span className='text-required'>*</span>
    </span>
  ) : (
    label
  );

  return (
    <TextField
      {...Object.assign({}, validTextAttributes, { valid: undefined })}
      className={`customInput ${className} ${novalidate ? '' : valid ? 'customInput-valid' : 'customInput-invalid'
        } ${starticon ? 'customInput-startIcon' : ''} ${inputClassName} ${disabled ? 'customInput-disabled' : ''} ${hideFieldset ? 'customInput--hideFieldset' : ''
        }`}
      inputRef={ref}
      variant='outlined'
      size={size}
      type={isShowPassword ? 'text' : type}
      fullWidth
      // error={!valid}
      minRows={minRows}
      maxRows={maxRows}
      disabled={disabled}
      multiline={isMultiline}
      label={requiredLabel}
      InputLabelProps={{
        shrink: inputShrink
      }}
      InputProps={
        isMultiline
          ? {}
          : {
            inputComponent: inputComponentProps,
            startAdornment: starticon && <InputAdornment position='start'>{starticon}</InputAdornment>,
            endAdornment: (endicon || ishavingpwicon) && (
              <InputAdornment position='end' sx={{ gap: isGapEndIcon ? '8px' : 0 }}>
                {ishavingpwicon ? (
                  <Box sx={{ cursor: 'pointer' }} onClick={() => setIsShowPassword(!isShowPassword)}>
                    {isShowPassword ? <img src={eyeSee} alt='show-pw' /> : <img src={eyes} alt='hide-pw' />}
                  </Box>
                ) : (
                  endicon
                )}
              </InputAdornment>
            )
          }
      }
    />
  );
});

export default CustomInput;
