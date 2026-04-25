import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import CommunityPostModal from "./communityPostModal.jsx";

function formatRelativeTimeACB(timestamp) {
  if (!timestamp?.toDate) return "";
  const diffMs = Date.now() - timestamp.toDate().getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const CATEGORIES = {
  safety:     { label: "Safety Tip", emoji: "🛡️", color: "#f97316", bg: "#fff7ed" },
  experience: { label: "Experience", emoji: "✈️", color: "#10b981", bg: "#ecfdf5" },
  question:   { label: "Question",   emoji: "❓", color: "#3b82f6", bg: "#eff6ff" },
};

function getInitialsACB(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function PostCard({ post, currentUid, onLike, onDelete }) {
  const liked = post.likedBy?.includes(currentUid) ?? false;
  const likeCount = post.likedBy?.length ?? 0;
  const isOwner = post.authorUid === currentUid;
  const initials = getInitialsACB(post.authorName);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.authorName || "Anonymous"}</Text>
          {!!post.locationTag && (
            <Text style={styles.locationTag}>📍 {post.locationTag}</Text>
          )}
        </View>
        {post.category && CATEGORIES[post.category] && (
          <View style={[styles.categoryBadge, { backgroundColor: CATEGORIES[post.category].bg }]}>
            <Text style={styles.categoryBadgeEmoji}>{CATEGORIES[post.category].emoji}</Text>
            <Text style={[styles.categoryBadgeLabel, { color: CATEGORIES[post.category].color }]}>
              {CATEGORIES[post.category].label}
            </Text>
          </View>
        )}
        <Text style={styles.timestamp}>{formatRelativeTimeACB(post.createdAt)}</Text>
      </View>

      <Text style={styles.postText}>{post.text}</Text>

      <View style={styles.cardFooter}>
        <Pressable
          onPress={() => onLike(post.id)}
          style={({ pressed }) => [styles.likeButton, pressed && styles.pressed]}
        >
          <Text style={[styles.likeIcon, liked && styles.likeIconActive]}>
            {liked ? "❤️" : "🤍"}
          </Text>
          <Text style={[styles.likeCount, liked && styles.likeCountActive]}>
            {likeCount}
          </Text>
        </Pressable>

        {isOwner && (
          <Pressable
            onPress={() => onDelete(post.id)}
            style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function CommunityView({
  posts,
  currentUid,
  postModalVisible,
  onOpenPostModal,
  onClosePostModal,
  onSubmitPost,
  onLike,
  onDelete,
}) {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Community & Vibes</Text>
        <Text style={styles.subheading}>
          Share safety tips and travel experiences with fellow solo travellers.
        </Text>

        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✈️</Text>
            <Text style={styles.emptyText}>No posts yet.</Text>
            <Text style={styles.emptyHint}>Be the first to share a tip!</Text>
          </View>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUid={currentUid}
              onLike={onLike}
              onDelete={onDelete}
            />
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={onOpenPostModal}
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <CommunityPostModal
        visible={postModalVisible}
        onClose={onClosePostModal}
        onSubmit={onSubmitPost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 14,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  subheading: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },

  // post card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  authorInfo: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  locationTag: {
    fontSize: 12,
    color: "#6b7280",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  categoryBadgeEmoji: {
    fontSize: 11,
  },
  categoryBadgeLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
  timestamp: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  postText: {
    fontSize: 15,
    color: "#1f2937",
    lineHeight: 22,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 8,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  likeIcon: {
    fontSize: 16,
  },
  likeIconActive: {},
  likeCount: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
  },
  likeCountActive: {
    color: "#ef4444",
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fef2f2",
  },
  deleteText: {
    fontSize: 13,
    color: "#ef4444",
    fontWeight: "600",
  },

  // empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  emptyHint: {
    fontSize: 14,
    color: "#9ca3af",
  },

  // floating action button
  fab: {
    position: "absolute",
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "300",
    lineHeight: 32,
  },
  pressed: {
    opacity: 0.7,
  },
});
