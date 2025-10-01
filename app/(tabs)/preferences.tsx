import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";

import { Block, Text, Input, Button } from "@/components";
import { useData } from "@/hooks";

const Preferences = () => {
  const { theme } = useData();
  const { colors, sizes, gradients } = theme;

  const [minAge, setMinAge] = useState("20");
  const [maxAge, setMaxAge] = useState("35");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");
  const [deen, setDeen] = useState("");
  const [waliVerified, setWaliVerified] = useState(false);

  const sanitizeAgeInput = (value: string) => value.replace(/\D/g, "");

  const handleMinAgeChange = (value: string) => {
    setMinAge(sanitizeAgeInput(value));
  };

  const handleMaxAgeChange = (value: string) => {
    setMaxAge(sanitizeAgeInput(value));
  };

  const applyFilters = () => {
    if (minAge && maxAge && Number(minAge) > Number(maxAge)) {
      Alert.alert(
        "Invalid age range",
        "Minimum age cannot be greater than maximum age."
      );
      return;
    }

    console.log({
      minAge,
      maxAge,
      location,
      education,
      deen,
      waliVerified,
    });
    // Later: send these filters to your backend or context
  };

  return (
    <Block safe flex={1} color={colors.background}>
      <ScrollView
        contentContainerStyle={{
          padding: sizes.m,
          paddingBottom: sizes.l,
        }}
      >
        <Text h5 semibold marginBottom={sizes.m}>
          Preferences & Filters
        </Text>

        {/* Age Range */}
        <Block row justify="space-between" marginBottom={sizes.m}>
          <Block flex={1} marginRight={sizes.s}>
            <Text gray size={sizes.s}>Min Age</Text>
            <Input
              keyboardType="numeric"
              value={minAge}
              onChangeText={handleMinAgeChange}
              placeholder="e.g. 20"
            />
          </Block>
          <Block flex={1} marginLeft={sizes.s}>
            <Text gray size={sizes.s}>Max Age</Text>
            <Input
              keyboardType="numeric"
              value={maxAge}
              onChangeText={handleMaxAgeChange}
              placeholder="e.g. 35"
            />
          </Block>
        </Block>

        {/* Location */}
        <Text gray size={sizes.s}>Location</Text>
        <Input
          placeholder="e.g. Srinagar, Delhi"
          value={location}
          onChangeText={setLocation}
          marginBottom={sizes.m}
        />

        {/* Education */}
        <Text gray size={sizes.s}>Education</Text>
        <Input
          placeholder="e.g. MSc, B.Tech, MBA"
          value={education}
          onChangeText={setEducation}
          marginBottom={sizes.m}
        />

        {/* Deen Practices */}
        <Text gray size={sizes.s}>Deen Preference</Text>
        <Input
          placeholder="e.g. 5x Salah, Hijab, Qur’an Study"
          value={deen}
          onChangeText={setDeen}
          marginBottom={sizes.m}
        />

        {/* Wali Verified */}
        <Block row align="center" marginVertical={sizes.m}>
          <Button
            gradient={waliVerified ? [colors.success, colors.success] : [colors.gray, colors.gray]}
            style={{
              borderRadius: 8,
              paddingVertical: sizes.s,
              paddingHorizontal: sizes.m,
            }}
            onPress={() => setWaliVerified(!waliVerified)}
          >
            <Text white>{waliVerified ? "✅ Wali Verified Only" : "Include All"}</Text>
          </Button>
        </Block>

        {/* Apply Filters */}
        <Button gradient={gradients.secondary} onPress={applyFilters}>
          <Text white bold>Apply Filters</Text>
        </Button>
      </ScrollView>
    </Block >
  );
};

export default Preferences;
