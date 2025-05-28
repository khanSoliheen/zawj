import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { useTheme } from '../theme/useTheme';

interface PreferenceValue {
  id: number;
  name: string;
}

interface Preference {
  id: number;
  name: string;
  help?: string;
  type: string;
  values?: PreferenceValue[]
}

interface PreferenceProps {
  preference: Preference
}

const PreferenceItem: React.FC<PreferenceProps> = ({ preference }) => {
  const theme = useTheme();
  
  const renderPreferenceType = () => {
    const inputStyle = {
      backgroundColor: theme.card,
      borderColor: theme.border,
      color: theme.text,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      marginTop: 8,
    };

    switch (preference.type) {
      case 'input':
        return <TextInput style={inputStyle} placeholderTextColor={theme.muted} />;
      case 'select':
        return <TextInput 
          value="Select" 
          editable={false}
          style={[inputStyle, { color: theme.muted }]} 
        />;
      case 'checkbox':
        return <TextInput 
          value="Checkbox" 
          editable={false}
          style={[inputStyle, { color: theme.muted }]} 
        />;
      case 'radio':
        return <TextInput 
          value="Radio" 
          editable={false}
          style={[inputStyle, { color: theme.muted }]} 
        />;
      case 'range':
        return <TextInput 
          value="Range" 
          editable={false}
          style={[inputStyle, { color: theme.muted }]} 
        />;
      default:
        return <Text style={{ color: theme.muted }}>Unsupported type</Text>;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>{preference.name}</Text>
      {preference.help && (
        <Text style={[styles.help, { color: theme.muted }]}>{preference.help}</Text>
      )}
      {renderPreferenceType()}
    </View>
  )
}

export default PreferenceItem

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  help: {
    fontSize: 12,
    marginTop: 4,
  }
})