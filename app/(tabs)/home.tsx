import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';

import { Block, Text, Input } from '@/components';
import { useTheme } from '@/hooks';

type IUser = {
  id: string;
  name: string;
  age: number;
  location: string;
  status: string;
  education: string;
  profession: string;
  deen: string[];
  wali: string;
  badges: string[];
};

const users: IUser[] = [
  {
    id: '1',
    name: 'Ayesha K.',
    age: 27,
    location: 'Srinagar, India',
    status: 'Single',
    education: 'MSc (Biology)',
    profession: 'Teacher',
    deen: ['5x Salah', 'Qur’an Study'],
    wali: 'Father (verified)',
    badges: ['Wali Verified'],
  },
  {
    id: '2',
    name: 'Ahmed R.',
    age: 30,
    location: 'Delhi, India',
    status: 'Divorced',
    education: 'B.Tech (Computer Science)',
    profession: 'Software Engineer',
    deen: ['Regular Salah', 'Hafiz al-Qur’an'],
    wali: 'Uncle (verified)',
    badges: ['ID Verified'],
  },
  {
    id: '3',
    name: 'Fatima S.',
    age: 24,
    location: 'Hyderabad, India',
    status: 'Single',
    education: 'BA (Islamic Studies)',
    profession: 'Student',
    deen: ['5x Salah', 'Hijab'],
    wali: 'Brother (pending)',
    badges: [],
  },
  {
    id: '4',
    name: 'Omar A.',
    age: 29,
    location: 'Lucknow, India',
    status: 'Single',
    education: 'MBA',
    profession: 'Business Analyst',
    deen: ['Jumu’ah Regular', 'Charity Work'],
    wali: 'Father (verified)',
    badges: ['Wali Verified', 'Community Verified'],
  },
  {
    id: '5',
    name: 'Zainab H.',
    age: 26,
    location: 'Bangalore, India',
    status: 'Widowed',
    education: 'BSc (Nursing)',
    profession: 'Nurse',
    deen: ['5x Salah', 'Qur’an Classes'],
    wali: 'Father-in-law (verified)',
    badges: ['Wali Verified'],
  },
];

const Home = () => {
  const { colors, sizes } = useTheme();

  const renderItem = ({ item }: { item: IUser }) => (
    <TouchableOpacity activeOpacity={0.9}>
      <Block
        scroll
        card
        color={colors.card}
        padding={sizes.m}
        marginBottom={sizes.sm}
        radius={sizes.radius}
        shadow
      >
        {/* Header: Name + Age */}
        <Block row justify="space-between" align="center" marginBottom={sizes.s}>
          <Text h5 semibold>
            {item.name}, {item.age}
          </Text>
          {item.badges.length > 0 && (
            <Block row>
              {item.badges.map((b, idx) => (
                <Block
                  key={idx}
                  radius={12}
                  paddingHorizontal={sizes.s}
                  marginLeft={idx > 0 ? sizes.s : 0}
                  color={colors.primary}
                >
                  <Text size={sizes.s} white semibold>
                    {b}
                  </Text>
                </Block>
              ))}
            </Block>
          )}
        </Block>

        {/* Location + Status */}
        <Text gray>{item.location}</Text>
        <Text gray>{item.status}</Text>

        {/* Education + Profession */}
        <Text>{item.education}</Text>
        <Text>{item.profession}</Text>

        {/* Deen Section */}
        <Block row wrap='wrap' marginTop={sizes.s}>
          {item.deen.map((d, idx) => (
            <Block
              key={idx}
              radius={10}
              paddingHorizontal={sizes.s}
              paddingVertical={sizes.xs}
              marginRight={sizes.s}
              marginBottom={sizes.xs}
              color={colors.light}
            >
              <Text size={sizes.s} gray>
                {d}
              </Text>
            </Block>
          ))}
        </Block>

        {/* Wali Info */}
        <Text marginTop={sizes.s} size={sizes.s} color={colors.success}>
          Wali: {item.wali}
        </Text>
      </Block>
    </TouchableOpacity>
  );

  return (
    <Block safe flex={1} color={colors.background} paddingHorizontal={sizes.padding}>
      {/* Search bar */}
      <Input search placeholder="Search profiles..." marginBottom={sizes.m} />

      {/* User List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.l }}
      />
    </Block>
  );
};

export default Home;
