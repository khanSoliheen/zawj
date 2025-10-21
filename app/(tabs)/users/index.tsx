import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';

import { Block, Text, Input, Image } from '@/components';
import { useData, useToast } from '@/hooks';
import { supabase } from '@/utils/supabase';
import { Utils } from '@/utils/utils';

type Row = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  gender: 'Male' | 'Female' | null;
  dob: string | null;

  country: string | null;
  state: string | null;
  city: string | null;

  education: string | null;
  employment_type: string | null;
  designation: string | null;
  department: string | null;

  marital_status: 'Single' | 'Married' | 'Divorced' | 'Widowed' | null;
  children_count?: string | null;

  prayer_regularity: '5x daily' | 'Regularly' | 'Sometimes' | 'Rarely' | 'Never' | null;
  quran_level: string | null;
  hijab_or_beard: 'Yes' | 'No' | 'Sometimes' | null;

  // Optional if you have them:
  avatar_url?: string | null;
  last_active_at?: string | null;
  createdAt?: string | null;  // keep camelCase if your table uses it
  updatedAt?: string | null;
};

const FACT_LABELS: Record<string, string> = {
  marital_status: 'Marital',
  prayer_regularity: 'Prayer',
  hijab_or_beard: 'Hijab/Beard',
  quran_level: 'Qur’an',
  children_count: 'Kids',
  employment_type: 'Employment',
  education: 'Education',
};

const kidsText = (count?: string | null) =>
  count && count !== '0'
    ? `${count} ${Number(count) === 1 ? 'child' : 'children'}`
    : count === '0'
      ? 'No children'
      : '';

const formatName = (u: Row) => {
  const first = u.gender === 'Female'
    ? (u.first_name?.charAt(0) ?? '')
    : (u.first_name ?? '');
  const last = u.last_name ?? '';
  return `${first} ${last}`.trim();
};

export default function Home() {
  const { theme } = useData();
  const { show } = useToast();
  const { colors, sizes, assets } = theme;

  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [from, setFrom] = useState(0);
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loadingMore, setLoadingMore] = useState(false);

  const PAGE = 20;

  const fetchPage = useCallback(async (reset = false) => {
    if (done && !reset) return;

    const start = reset ? 0 : from;
    const end = start + PAGE - 1;

    if (reset) { setLoading(true); setDone(false); setFrom(0); }

    const { data, error, count } = await supabase
      .from('profiles_card_v')
      .select('*', { count: 'exact' })
      .order('id', { ascending: false })   // or created_at if available
      .range(start, end);

    if (error) { show('error', error.message); setLoading(false); return; }

    const page = Array.isArray(data) ? data : [];
    // 2) **De-dup by id** before setting state
    setRows(prev => {
      const seen = new Set(prev.map(r => r.id));
      const merged = reset ? page : [...prev, ...page.filter(r => !seen.has(r.id))];
      return merged;
    });

    const reachedEnd = (count != null) ? (end + 1 >= count) : (page.length < PAGE);
    setDone(reachedEnd);
    setFrom(start + PAGE);
    setLoading(false);
  }, [from, done, show]);

  useEffect(() => { void fetchPage(true); }, [fetchPage]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPage(true);
    setRefreshing(false);
  };

  const startOrOpenThread = async (targetUserId: string) => {
    const { data, error } = await supabase.rpc('start_or_get_thread', { invitee: targetUserId });
    if (error) return show('error', error.message);
    router.push({ pathname: '/chat/[id]', params: { id: data as string } });
  };

  const toggleExpand = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const renderCard = ({ item }: { item: Row }) => {
    const age = item.dob ? Utils.getAge(item.dob) : undefined;
    const nameLine = [formatName(item), age ? `· ${age}` : null].filter(Boolean).join(' ');

    const place = [item.city, item.state, item.country].filter(Boolean).join(', ');
    const work = item.designation || item.department || item.education || item.employment_type || '';
    const meta = [place, work].filter(Boolean).join(' • ');

    // (Optional) last active label if you later store it
    let lastActive = '';
    if (item.last_active_at) {
      const diff = Date.now() - new Date(item.last_active_at).getTime();
      if (diff < 60_000) lastActive = 'Active now';
      else if (diff < 60 * 60_000) lastActive = `${Math.round(diff / 60_000)}m ago`;
      else lastActive = 'Recently';
    }

    // Primary, compact fact line
    const primaryFacts: Array<{ label: string; value: string }> = [
      { label: FACT_LABELS.marital_status, value: item.marital_status || '' },
      { label: FACT_LABELS.prayer_regularity, value: item.prayer_regularity || '' },
      { label: FACT_LABELS.hijab_or_beard, value: item.hijab_or_beard || '' },
    ].filter(f => !!f.value);

    // More details (collapsible)
    const moreFacts: Array<{ label: string; value: string }> = [
      { label: FACT_LABELS.quran_level, value: item.quran_level || '' },
      { label: FACT_LABELS.children_count, value: kidsText(item.children_count) || '' },
      { label: FACT_LABELS.employment_type, value: item.employment_type || '' },
      { label: FACT_LABELS.education, value: item.education || '' },
    ].filter(f => !!f.value);

    const hasMoreFacts = moreFacts.length > 0;
    const primaryFactsText = primaryFacts
      .map(f => `${f.label}: ${f.value}`)
      .join('  •  ');

    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/users/${item.id}`)}>
        <Block
          color={colors.card}
          padding={sizes.m}
          marginBottom={sizes.sm}
          radius={sizes.radius}
          shadow
        >
          {/* Header */}
          <Block row align="center">
            <Image
              radius={12}
              width={56}
              height={56}
              source={item.avatar_url ? { uri: item.avatar_url } : assets.avatar1}
            />
            <Block marginLeft={sizes.s}>
              <Text h6 semibold>{nameLine}</Text>
              {meta ? (
                <Text size={12} color={colors.gray} marginTop={2}>{meta}</Text>
              ) : null}
            </Block>
          </Block>

          {/* Compact fact line */}
          {!!primaryFacts.length && (
            <Block marginTop={sizes.s}>
              <Block row wrap="wrap" align="center">
                <Text size={12} color={colors.gray}>
                  {primaryFactsText}
                </Text>
                {hasMoreFacts && (
                  <Text
                    size={12}
                    semibold
                    color={colors.link}
                    marginLeft={sizes.xs}
                    onPress={() => toggleExpand(item.id)}
                  >
                    {expanded[item.id] ? 'less...' : 'more...'}
                  </Text>
                )}
              </Block>
            </Block>
          )}

          {/* More details */}
          {hasMoreFacts && expanded[item.id] && (
            <Block marginTop={sizes.xs}>
              {moreFacts.map((f) => (
                <Text key={`${item.id}-${f.label}`} size={12} color={colors.gray} marginTop={4}>
                  <Text semibold size={12}>{f.label}:</Text>{` ${f.value}`}
                </Text>
              ))}
            </Block>
          )}

          {/* Last active (optional) */}
          {lastActive ? (
            <Text size={11} color={colors.gray} marginTop={sizes.xs}>
              {lastActive}
            </Text>
          ) : null}
        </Block>
      </TouchableOpacity>
    );
  };

  return (
    <Block safe flex={1} color={colors.background} paddingHorizontal={sizes.padding}>
      <Input
        search
        placeholder="Search profiles…"
        marginBottom={sizes.s}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.l, paddingTop: sizes.s }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!loading && !loadingMore && !done) {
            setLoadingMore(true);
            fetchPage(false).finally(() => setLoadingMore(false));
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text as string}
          />
        }
        ListEmptyComponent={
          loading
            ? <Text p center color={colors.gray}>Loading…</Text>
            : <Text p center color={colors.gray}>No profiles found</Text>
        }
      />
    </Block>
  );
}
