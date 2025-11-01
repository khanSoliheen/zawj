import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { Block, Text, Input, Modal, Button } from '@/components';

type Props = {
  label: string;
  placeholder?: string;
  value?: string;
  options: string[];
  error?: string;
  onChange: (val: string) => void;
};

export default function SelectInput({
  label,
  placeholder = 'Select',
  value,
  options,
  error,
  onChange,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <Block flex={0}>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Input
          label={label}
          value={value}
          placeholder={placeholder}
          editable={false}
          pointerEvents="none"
          error={error}
        />
      </TouchableOpacity>

      <Modal visible={show} onRequestClose={() => setShow(false)}>
        {options.map((option) => (
          <Button key={option} onPress={() => { onChange(option); setShow(false); }}>
            <Text>{option}</Text>
          </Button>
        ))}
      </Modal>
    </Block>
  );
}
