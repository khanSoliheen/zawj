import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PreferenceItem from './PreferenceItem';
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
interface PreferenceGroup {
  id: number;
  name: string;
  preferences: Preference[]
}

interface PreferenceGroupProps {
  preferenceGroup: PreferenceGroup[]
}

const PreferenceList: React.FC<PreferenceGroupProps> = ({ preferenceGroup }) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {preferenceGroup.map((item) => (
        <View 
          key={item.id} 
          style={[
            styles.groupContainer,
            { 
              backgroundColor: theme.card,
              borderColor: theme.border
            }
          ]}
        >
          <Text style={[styles.groupTitle, { color: theme.text }]}>{item.name}</Text>
          {item.preferences.map((pref) => (
            <PreferenceItem key={`${pref.id}${pref.type}`} preference={pref} />
          ))}
        </View>
      ))}
    </View>
  )
}

export default PreferenceList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
  },
  groupContainer: {
    borderRadius: 12,
    borderWidth: 0.2,
    padding: 16,
    marginBottom: 16,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  }
})