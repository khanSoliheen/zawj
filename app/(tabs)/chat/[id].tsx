import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList } from 'react-native';

import { AcceptMessage, Block, Bubble, Button, DateDivider, Image, Input, MoreMenu, Text, TimeStamp } from '@/components';
import { useAuth, useData, useToast } from '@/hooks';
import { supabase } from '@/utils/supabase';

export type Message = {
  id: string;
  text: string;
  at: string;
  sender_id: string;
  avatar?: string | null;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

type Connection = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'blocked' | 'declined';
  created_at?: string;
  updated_at?: string;
};

export default function Chat() {
  const { theme } = useData();
  const { currentUser } = useAuth();
  const { show } = useToast();
  const { colors, sizes, assets, gradients } = theme;

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<any>>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // NEW: connection object
  const [connection, setConnection] = useState<Connection | null>(null);
  const [showAccept, setShowAccept] = useState(false);
  const [busyAction, setBusyAction] = useState(false);

  // ✅ safer param hook
  const { id: conversationId, name, peerId: rawPeerId } = useLocalSearchParams<{ id?: string; name?: string; peerId?: string }>();
  const userId = currentUser?.id;
  const peerId = String(rawPeerId ?? ''); // ensure string; adjust if your route uses a different key
  // ✅ avatars (me vs them)
  const meAvatar = assets.avatar2 ?? assets.avatar1;
  const themAvatar = assets.avatar1 ?? assets.avatar2;

  // ---- Fetch connection between current user and peer (in either direction)
  const fetchConnection = async () => {
    if (!userId || !peerId) return;
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .or(
        // requester:me & addressee:them  OR  requester:them & addressee:me
        `and(requester_id.eq.${userId},addressee_id.eq.${peerId}),and(requester_id.eq.${peerId},addressee_id.eq.${userId})`
      )
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      show('error', error.message);
      return;
    }
    setConnection(data ?? null);
  };

  useEffect(() => {
    fetchConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, peerId]);

  // ---- When connection is pending and current user is the addressee, show accept sheet
  useEffect(() => {
    if (!connection || connection.status !== 'pending') {
      setShowAccept(false);
      return;
    }
    const iAmAddressee = connection.addressee_id === userId;
    console.log(iAmAddressee, connection.addressee_id, userId);
    setShowAccept(iAmAddressee);
  }, [connection, userId]);

  // ✅ fetch old messages
  useEffect(() => {
    if (!conversationId) return;

    const fetchOldMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) return show('error', error.message);

      setMessages(
        data.map((m: any) => ({
          id: m.id,
          text: m.message ?? m.content,
          at: m.created_at,
          sender_id: m.sender_id,
          avatar: null,
        }))
      );
    };

    (async () => {
      await fetchOldMessages();
    })();
  }, [conversationId, show]);


  // ✅ realtime: messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const m: any = payload.new;
          setMessages((prev) => (prev.some((msg) => msg.id === m.id) ? prev : [
            ...prev,
            { id: m.id, text: m.message ?? m.content, at: m.created_at, sender_id: m.sender_id, avatar: null }
          ]));
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  // ✅ realtime: connection status updates
  useEffect(() => {
    if (!userId || !peerId) return;
    const channel = supabase
      .channel(`conn-${userId}-${peerId}`)
      .on('postgres_changes',
        {
          event: '*', schema: 'public', table: 'connections',
          filter: `or(and(requester_id.eq.${userId},addressee_id.eq.${peerId}),and(requester_id.eq.${peerId},addressee_id.eq.${userId}))`
        },
        (payload) => {
          const row = payload.new as Connection;
          setConnection(row);
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, peerId]);

  // ✅ send message (gate by connection status)
  const sendMessage = async () => {
    const content = text.trim();
    if (!content || !userId || !conversationId) return;

    // If no connection: create pending and stop
    if (!connection) {
      const { error } = await supabase.from('connections').insert({
        requester_id: userId,
        addressee_id: peerId,
        status: 'pending',
      });
      if (error) return show('error', error.message);
      show('success', 'Message request sent');
      setText('');
      await fetchConnection();
      return;
    }

    // If blocked/declined: stop
    if (connection.status === 'blocked' || connection.status === 'declined') {
      return show('error', 'You cannot send messages to this user.');
    }

    // If pending and I'm requester: do not send until accepted
    if (connection.status === 'pending' && connection.requester_id === userId) {
      return show('info', 'Waiting for the user to accept your request.');
    }

    // If pending and I'm addressee: show accept UI
    if (connection.status === 'pending' && connection.addressee_id === userId) {
      setShowAccept(true);
      return;
    }

    // OK to send
    setText('');
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: userId,
      content,
    });

    if (error) {
      show("error", error.message);
      setText(content);
      return;
    }
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  // ✅ accept / decline handlers
  const acceptRequest = async () => {
    if (!connection) return;
    setBusyAction(true);
    const { error } = await supabase
      .from('connections')
      .update({ status: 'accepted', responded_at: new Date().toISOString() })
      .eq('id', connection.id);
    setBusyAction(false);
    if (error) return show('error', error.message);
    setShowAccept(false);
    show('success', 'Request accepted');
  };

  const declineRequest = async () => {
    if (!connection) return;
    setBusyAction(true);
    const { error } = await supabase
      .from('connections')
      .update({ status: 'declined', responded_at: new Date().toISOString() })
      .eq('id', connection.id);
    setBusyAction(false);
    if (error) return show('error', error.message);
    setShowAccept(false);
    show('info', 'Request declined');
  };

  // ✅ group by date for FlatList
  const flatData = useMemo(() => {
    const groups: Record<string, Message[]> = {};
    messages.forEach((m) => {
      const k = fmtDate(m.at);
      if (!groups[k]) groups[k] = [];
      groups[k].push(m);
    });
    const rows: Array<{ type: 'header'; header: string } | ({ type: 'msg' } & Message)> = [];
    Object.entries(groups)
      .sort((a, b) => new Date(a[1][0].at).getTime() - new Date(b[1][0].at).getTime())
      .forEach(([header, data]) => {
        rows.push({ type: 'header', header });
        data.forEach((m) => rows.push({ type: 'msg', ...m }));
      });
    return rows;
  }, [messages]);

  const canType = connection?.status === 'accepted' || !connection; // allow typing to create request
  const isPendingAddressee = connection?.status === 'pending' && connection.addressee_id === userId;

  return (
    <Block color={colors.background}>
      {/* header */}
      <Block
        flex={0}
        row
        align="flex-start"
        color={colors.white}
        paddingHorizontal={sizes.s}
      >
        {/* Left side */}
        <Block row align="center">
          <Button row flex={0} justify="center" width={0} onPress={() => router.back()}>
            <Image radius={0} width={10} height={18} color={colors.gray} source={assets.arrow} transform={[{ rotate: '180deg' }]} />
          </Button>
          <Image source={themAvatar} width={28} height={28} radius={14} marginRight={sizes.s} />
          <Text h5>{name}</Text>
        </Block>

        {/* Right side */}
        <Block row align="center" />
        {/* FIX: pass peerId to MoreMenu, not my own id */}
        <Button onPress={() => setMenuOpen((prev) => !prev)}>
          <Image radius={0} width={20} height={20} source={assets.more} color={colors.text} />
        </Button>
      </Block>

      {/* messages */}
      <Block flex={1} marginBottom={10}>
        <FlatList
          ref={listRef}
          data={flatData}
          keyExtractor={(item, idx) =>
            'type' in item && item.type === 'header' ? `h-${item.header}-${idx}` : (item as any).id
          }
          contentContainerStyle={{ paddingHorizontal: sizes.m, paddingBottom: sizes.s, paddingTop: sizes.s }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if ('type' in item && item.type === 'header') return <DateDivider title={item.header} />;
            const m = item as Message;
            return (
              <Block>
                <Bubble m={m} userId={userId!} meAvatar={meAvatar} themAvatar={themAvatar} />
                <TimeStamp iso={m.at} align={m.sender_id === userId ? 'right' : 'left'} />
              </Block>
            );
          }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
        />
      </Block>

      {/* input bar */}
      <Block
        row
        flex={0}
        align="center"
        style={{ marginHorizontal: sizes.m, marginBottom: sizes.md, paddingHorizontal: sizes.s, paddingVertical: sizes.s }}
      >
        <Block flex={1} marginHorizontal={sizes.s}>
          <Input
            placeholder={isPendingAddressee ? "Accept the request to reply…" : "Enter your message"}
            value={text}
            onChangeText={setText}
            multiline
            editable={canType && !isPendingAddressee}
          />
        </Block>
        <Button
          gradient={gradients.dark}
          style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
          onPress={sendMessage}
          disabled={isPendingAddressee}
        >
          <Image source={assets.arrow} width={16} height={16} color={colors.white} transform={[{ rotate: '315deg' }]} />
        </Button>
      </Block>

      {/* menus & sheets */}
      <MoreMenu
        targetUserId={peerId || String(name)}   // <-- pass the OTHER user id here (fallback if needed)
        visible={menuOpen}
        chatId={String(conversationId)}
        onClose={() => setMenuOpen(false)}
      />

      {/* Accept sheet (overlay) */}
      <AcceptMessage
        visible={showAccept}
        message={`Accept message request from ${name}?`}
        actionLabel="Accept"
        onAction={acceptRequest}
        onDecline={declineRequest}
        onClose={() => setShowAccept(false)}
        loading={busyAction}
      />
    </Block>
  );
}
