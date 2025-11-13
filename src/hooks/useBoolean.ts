import React from 'react';

export function useBoolean(initial = false) {
  const [value, setValue] = React.useState(initial);

  const setTrue = React.useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = React.useCallback(() => {
    setValue(false);
  }, []);

  const toggle = React.useCallback(() => {
    setValue((x) => !x);
  }, []);

  const intermittentChange = React.useCallback((newVal: boolean, timeout = 3000) => {
    setValue(newVal);

    setTimeout(() => {
      setValue(!newVal);
    }, timeout);
  }, []);

  return { value, setValue, setTrue, setFalse, toggle, intermittentChange };
}
