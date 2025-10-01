import * as Haptics from 'expo-haptics';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ViewProps } from 'react-native';

import { Block } from '@/components';

type RadioGroupContextType<T = string | number> = {
  value?: T;
  disabled?: boolean;
  onChange: (val: T) => void;
  haptic: boolean;
};

const RadioGroupCtx = createContext<RadioGroupContextType | null>(null);

type RadioGroupProps<T = string | number> = ViewProps & {
  value?: T;                 // controlled
  defaultValue?: T;          // uncontrolled
  onValueChange?: (val: T) => void;
  disabled?: boolean;
  haptic?: boolean;
  row?: boolean;
  gap?: number;
  children: React.ReactNode;
};

export function RadioGroup<T = string | number>({
  value,
  defaultValue,
  onValueChange,
  disabled,
  haptic = true,
  row = false,
  gap = 12,
  style,
  children,
  ...rest
}: RadioGroupProps<T>) {
  const [internal, setInternal] = useState<T | undefined>(defaultValue);

  const selected = value !== undefined ? value : internal;

  const handleChange = useCallback((val: T) => {
    if (haptic) Haptics.selectionAsync();
    if (value === undefined) setInternal(val);
    onValueChange?.(val);
  }, [haptic, onValueChange, value]);

  const ctx = useMemo(() => ({
    value: selected,
    disabled,
    onChange: handleChange as (v: string | number) => void,
    haptic,
  }), [selected, disabled, handleChange, haptic]);

  return (
    <RadioGroupCtx.Provider value={ctx}>
      <Block
        row={row}
        style={[row && { columnGap: gap }, !row && { rowGap: gap }, style]}
        {...rest}
      >
        {children}
      </Block>
    </RadioGroupCtx.Provider>
  );
}

export function useRadioGroup() {
  const ctx = useContext(RadioGroupCtx);
  return ctx;
}
