import React, { useEffect, useReducer, useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  // gets last stage and action
  const emailReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { isValid: action.val.includes('@'), value: action.val };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 6 };
    }
    return { value: '', isValid: false };
  };

  const passwordReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.trim().length > 6 };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 6 };
    }
    return { value: '', isValid: false };
  };

  const [emailState, emailDispatcher] = useReducer(emailReducer, { value: '', isValid: null });
  const [passwordState, passwordDispatcher] = useReducer(passwordReducer, {
    value: '',
    isValid: null
  });

  // we destructure isValid propoerty from state to only run when validity changes
  // ie if we had added emailState.isValid then it will run on every changes
  const { isValid: isEmailValid } = emailState;
  const { isValid: isPasswordValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity!');
      setFormIsValid(isEmailValid && isPasswordValid);
    }, 500);

    return () => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    };
  }, [isEmailValid, isPasswordValid]);

  const emailChangeHandler = (event) => {
    // dispatch using type and payload
    emailDispatcher({ type: 'USER_INPUT', val: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    passwordDispatcher({ type: 'USER_INPUT', val: event.target.value });
    // setEnteredPassword(event.target.value);
  };

  const validateEmailHandler = () => {
    emailDispatcher({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    passwordDispatcher({ type: 'INPUT_BLUR' });
    // setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div className={`${classes.control} ${emailState.isValid === false ? classes.invalid : ''}`}>
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" value={emailState.value} onChange={emailChangeHandler} onBlur={validateEmailHandler} />
        </div>
        <div className={`${classes.control} ${passwordState.isValid === false ? classes.invalid : ''}`}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
