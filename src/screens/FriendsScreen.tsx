import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Image,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../../firebase';
import { Friendship, User } from '../types';
import { GamificationService } from '../services/gamificationService';

interface FriendsScreenProps {
  onBack: () => void;
  onInviteToQuiz: (friend: User) => void;
}

const { width } = Dimensions.get('window');

export const FriendsScreen: React.FC<FriendsScreenProps> = ({ onBack, onInviteToQuiz }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [sentRequests, setSentRequests] = useState<Friendship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Listen for friends
    const friendsQuery = query(
      collection(db, 'friendships'),
      where('status', '==', 'accepted'),
      where('sender', '==', user.uid)
    );

    const unsubscribeFriends = onSnapshot(friendsQuery, async (snapshot) => {
      const friendIds = snapshot.docs.map(doc => doc.data().receiver);
      const friendsData: User[] = [];

      for (const friendId of friendIds) {
        try {
          const friendDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', friendId)));
          if (!friendDoc.empty) {
            const friendData = friendDoc.docs[0].data() as User;
            friendsData.push(friendData);
          }
        } catch (error) {
          console.error('Error fetching friend data:', error);
        }
      }

      setFriends(friendsData);
    });

    // Listen for pending requests
    const pendingQuery = query(
      collection(db, 'friendships'),
      where('receiver', '==', user.uid),
      where('status', '==', 'pending')
    );

    const unsubscribePending = onSnapshot(pendingQuery, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Friendship[];
      setPendingRequests(requests);
    });

    // Listen for sent requests
    const sentQuery = query(
      collection(db, 'friendships'),
      where('sender', '==', user.uid),
      where('status', '==', 'pending')
    );

    const unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Friendship[];
      setSentRequests(requests);
    });

    return () => {
      unsubscribeFriends();
      unsubscribePending();
      unsubscribeSent();
    };
  }, [user]);

  const handleSearchUser = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a username or email');
      return;
    }

    setLoading(true);
    try {
      // Search by username first, then by email
      let usersQuery = query(
        collection(db, 'users'),
        where('username', '==', searchQuery.trim().toLowerCase())
      );
      let snapshot = await getDocs(usersQuery);

      // If no username found, try email
      if (snapshot.empty) {
        usersQuery = query(
          collection(db, 'users'),
          where('email', '==', searchQuery.trim())
        );
        snapshot = await getDocs(usersQuery);
      }

      if (snapshot.empty) {
        Alert.alert('User Not Found', 'No user found with this username or email');
        return;
      }

      const foundUser = snapshot.docs[0].data() as User;
      
      if (foundUser.uid === user?.uid) {
        Alert.alert('Error', 'You cannot add yourself as a friend');
        return;
      }

      // Check if already friends or request exists
      const existingRequest = [...pendingRequests, ...sentRequests].find(
        req => (req.sender === user?.uid && req.receiver === foundUser.uid) ||
               (req.receiver === user?.uid && req.sender === foundUser.uid)
      );

      if (existingRequest) {
        Alert.alert('Request Exists', 'You already have a pending friend request with this user');
        return;
      }

      // Send friend request
      await addDoc(collection(db, 'friendships'), {
        sender: user?.uid,
        receiver: foundUser.uid,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      Alert.alert('Success', 'Friend request sent!');
      setSearchQuery('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send friend request');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (request: Friendship) => {
    try {
      await updateDoc(doc(db, 'friendships', request.id), {
        status: 'accepted',
        updatedAt: new Date()
      });
      
      // Add gamification rewards for accepting friend request
      await GamificationService.addFriend(user?.uid || '');
      
      Alert.alert('Success', 'Friend request accepted!');
    } catch (error) {
      Alert.alert('Error', 'Failed to accept friend request');
    }
  };

  const handleDeclineRequest = async (request: Friendship) => {
    try {
      await updateDoc(doc(db, 'friendships', request.id), {
        status: 'declined',
        updatedAt: new Date()
      });
      Alert.alert('Success', 'Friend request declined');
    } catch (error) {
      Alert.alert('Error', 'Failed to decline friend request');
    }
  };

  const renderFriend = ({ item }: { item: User }) => (
    <View style={styles.friendItem}>
      <Image
        source={{ uri: item.avatar || 'https://via.placeholder.com/50' }}
        style={styles.friendAvatar}
      />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendEmail}>@{item.username}</Text>
      </View>
      <TouchableOpacity
        style={styles.inviteButton}
        onPress={() => onInviteToQuiz(item)}
      >
        <Ionicons name="play-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderPendingRequest = ({ item }: { item: Friendship }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestInfo}>
        <Text style={styles.requestText}>Friend request from {item.sender}</Text>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptRequest(item)}
        >
          <Ionicons name="checkmark" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => handleDeclineRequest(item)}
        >
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Friends</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Add Friend Section */}
        <View style={styles.addFriendSection}>
          <Text style={styles.sectionTitle}>Add Friend</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter username or email"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.searchButton, loading && styles.disabledButton]}
              onPress={handleSearchUser}
              disabled={loading}
            >
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            <FlatList
              data={pendingRequests}
              renderItem={renderPendingRequest}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Friends List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Friends ({friends.length})
          </Text>
          {friends.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#fff" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No friends yet</Text>
              <Text style={styles.emptySubtext}>Add friends to take quizzes together!</Text>
            </View>
          ) : (
            <FlatList
              data={friends}
              renderItem={renderFriend}
              keyExtractor={(item) => item.uid}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addFriendSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  section: {
    flex: 1,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  friendEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  inviteButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  requestInfo: {
    flex: 1,
  },
  requestText: {
    fontSize: 14,
    color: '#fff',
  },
  requestActions: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  declineButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
});
