import { router } from 'expo-router';
import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';

import { Block, Text, Input } from '@/components';
import { useAuth, useData, useToast } from '@/hooks';
import { RegistrationData } from '@/store/registration';
import { supabase } from '@/utils/supabase';
import { Utils } from '@/utils/utils';

const formatName = (user: RegistrationData) => {
  if (user.gender === 'Female') {
    return `${user.firstName.charAt(0)} ${user.lastName}`;
  }
  return `${user.firstName} ${user.lastName}`;
};


const Home = () => {
  const { theme } = useData();
  const { show } = useToast();
  const { currentUser } = useAuth();
  const { colors, sizes } = theme;

  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<RegistrationData[]>([]);
  const deferredValue = useDeferredValue(query);

  useEffect(() => {
    async function getUsers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        show('error', error.message);
      } else {
        setUsers(data);
      }
    }
    getUsers();
  }, [show, users]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = deferredValue.trim().toLowerCase();
    if (!normalizedQuery) return users.filter(u => u.id !== currentUser?.id);

    return users.filter((user) => {
      // skip current user
      if (user.id === currentUser?.id) return false;

      // collect values to search in
      const searchableValues = [
        user.firstName ?? "",
        user.lastName ?? "",
        user.dob ? String(Utils.getAge(user.dob)) : "",
        user.state ?? "",
      ];

      return searchableValues.some((v) =>
        v.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [users, deferredValue, currentUser?.id]);

  const renderItem = ({ item }: { item: RegistrationData }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/users/${item.id}`)} // navigate to details
    >
      <Block
        card
        color={colors.card}
        padding={sizes.m}
        marginBottom={sizes.sm}
        radius={sizes.radius}
        shadow
      >
        {/* Header */}
        <Block row justify="space-between" align="center" marginBottom={sizes.s}>
          <Text h5 semibold>
            {formatName(item)}, {Utils.getAge(item.dob)}
          </Text>
          {/*{item.badges.length > 0 && (
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
          )}*/}
        </Block>

        <Text gray>{item.state}</Text>
        {/*<Text gray>{item.status}</Text>
        <Text>{item.education}</Text>
        <Text>{item.profession}</Text>*/}

        {/* Deen highlights */}
        {/*<Block row wrap='wrap' marginTop={sizes.s}>
          {item.deen.slice(0, 3).map((d, idx) => (
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
        </Block>*/}
      </Block>
    </TouchableOpacity>
  );

  return (
    <Block safe flex={1} color={colors.background} paddingHorizontal={sizes.padding}>
      <Input
        search
        placeholder="Search profiles..."
        marginBottom={sizes.s}
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.l }}
        ListEmptyComponent={<Text center>No profiles found</Text>}
      />
    </Block>
  );
};

export default Home;
