import React from 'react'
import { Text, StyleSheet, ScrollView } from 'react-native'
import { PreferenceList } from '../components'
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

const preferenceData: PreferenceGroup[] = [
  {
    "id": 1,
    "name": "Notifications",
    "preferences": [
      {
        "id": 10,
        "type": 'input',
        "name": "Email Alerts",
        "help": "Enable or disable email alerts",
        "values": [
          { "id": 100, "name": "Enabled" },
          { "id": 101, "name": "Disabled" }
        ]
      },
      {
        "id": 11,
        "type": 'select',
        "name": "SMS Alerts",
        "help": "Get notified via SMS",
        "values": [
          { "id": 102, "name": "Yes" },
          { "id": 103, "name": "No" }
        ]
      }
    ]
  },
  {
    "id": 2,
    "name": "Privacy",
    "preferences": [
      {
        "id": 12,
        "type": 'input',
        "name": "Profile Visibility",
        "help": "Who can see your profile",
        "values": [
          { "id": 104, "name": "Public" },
          { "id": 105, "name": "Friends Only" },
          { "id": 106, "name": "Private" }
        ]
      },
      {
        "id": 12,
        "type": 'range',
        "name": "Reach",
        "help": "Who can see your profile",
        "values": [
          { "id": 104, "name": "Public" },
          { "id": 105, "name": "Friends Only" },
          { "id": 106, "name": "Private" }
        ]
      },
      {
        "id": 12,
        "type": 'radio',
        "name": "Gender",
        "help": "Who can see your profile",
        "values": [
          { "id": 104, "name": "Public" },
          { "id": 105, "name": "Friends Only" },
          { "id": 106, "name": "Private" }
        ]
      },
    ]
  }
]

export default function Preferences() {
  const theme = useTheme();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: theme.text }]}>Preferences</Text>
      <PreferenceList preferenceGroup={preferenceData} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  }
})