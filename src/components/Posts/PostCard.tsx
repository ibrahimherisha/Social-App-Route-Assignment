import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ActionIcon, Avatar, Button, Card, FileInput, Group, Image, Text, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Bookmark, Heart, MessageCircle, Pencil, Share2, Trash2 } from "lucide-react";
import type { Post } from "../../types.ts";
import type { UpdatePostReq } from "../../api/Posts/types.ts";
import { bookmarkPost, deletePost, likePost, sharePost, updatePost } from "../../api/Posts/api.ts";
import { useAuth } from "../../context/useAuth.ts";

const LIKED_COLOR = "#fb4d6d";
const SAVED_COLOR = "#22d3ee";

export default function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.body ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Live preview of the newly picked image. The browser makes a temporary
  // URL for the file; we release it when the file changes or the card unmounts.
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  // Did I like this post? The API sends the list of user ids who liked it.
  const liked = user ? (post.likes ?? []).includes(user._id) : false;
  const isMine = user?._id === post.user._id;

  // After any action, refetch the ["posts"] list so the counts update.
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.invalidateQueries({ queryKey: ["post"] });
    queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
  };

  const likeMutation = useMutation({
    mutationFn: (postId: string) => likePost(postId),
    onSuccess: refresh,
  });

  const shareMutation = useMutation({
    mutationFn: (postId: string) => sharePost(postId),
    onSuccess: refresh,
  });

  const bookmarkMutation = useMutation({
    mutationFn: (postId: string) => bookmarkPost(postId),
    onSuccess: refresh,
  });

  const updateMutation = useMutation({
    mutationFn: (req: UpdatePostReq) => updatePost(post._id, req),
    onSuccess: () => {
      setEditing(false);
      setImage(null);
      refresh();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(post._id),
    onSuccess: refresh,
  });

  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Delete this post?",
      children: <Text size="sm">This can&apos;t be undone.</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteMutation.mutate(),
    });
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setDraft(post.body ?? "");
    setImage(null);
  };

  return (
    <Card padding="lg" className="post-card">
      <Group gap="sm" mb="sm">
        <div className="av-ring">
          <Avatar src={post.user.photo} alt={post.user.name} radius="xl" size={46}>
            {post.user.name[0]}
          </Avatar>
        </div>
        <div>
          <Text fw={700} size="sm" className="font-display">
            {post.user.name}
          </Text>
          <Text size="xs" c="dimmed">
            @{post.user.username} · {new Date(post.createdAt).toLocaleString()}
          </Text>
        </div>
      </Group>

      {editing ? (
        <>
          <Textarea value={draft} onChange={(e) => setDraft(e.currentTarget.value)} autosize minRows={2} mb="sm" />
          {preview ? (
            <Image src={preview} alt="New image preview" className="post-image" mb="sm" />
          ) : (
            post.image && <Image src={post.image} alt="Current post image" className="post-image" mb="sm" />
          )}
          <FileInput
            placeholder="Change image (optional)"
            accept="image/*"
            value={image}
            onChange={setImage}
            clearable
            mb="sm"
          />
          <Group gap="xs" mb="sm">
            <Button
              size="xs"
              className="btn-gradient"
              loading={updateMutation.isPending}
              disabled={!draft.trim() && !image}
              onClick={() => updateMutation.mutate({ body: draft.trim(), image })}>
              Save
            </Button>
            <Button size="xs" variant="subtle" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </Group>
        </>
      ) : (
        post.body && (
          <Text size="sm" mb="sm">
            {post.body}
          </Text>
        )
      )}

      {!editing && post.image && <Image src={post.image} alt="Post image" className="post-image" mb="sm" />}

      <Group gap="lg">
        <Group gap={4}>
          <ActionIcon
            variant="subtle"
            aria-label="Like"
            aria-pressed={liked}
            disabled={likeMutation.isPending}
            onClick={() => likeMutation.mutate(post._id)}>
            <Heart size={18} color={liked ? LIKED_COLOR : undefined} fill={liked ? LIKED_COLOR : "none"} />
          </ActionIcon>
          <Text size="sm">{post.likesCount}</Text>
        </Group>

        <Group gap={4}>
          <ActionIcon variant="subtle" aria-label="Comments" onClick={() => navigate(`/posts/${post._id}`)}>
            <MessageCircle size={18} />
          </ActionIcon>
          <Text size="sm">{post.commentsCount}</Text>
        </Group>

        <Group gap={4}>
          <ActionIcon
            variant="subtle"
            aria-label="Share"
            disabled={shareMutation.isPending}
            onClick={() => shareMutation.mutate(post._id)}>
            <Share2 size={18} />
          </ActionIcon>
          <Text size="sm">{post.sharesCount}</Text>
        </Group>

        <ActionIcon
          variant="subtle"
          aria-label="Bookmark"
          aria-pressed={post.bookmarked}
          disabled={bookmarkMutation.isPending}
          onClick={() => bookmarkMutation.mutate(post._id)}>
          <Bookmark
            size={18}
            color={post.bookmarked ? SAVED_COLOR : undefined}
            fill={post.bookmarked ? SAVED_COLOR : "none"}
          />
        </ActionIcon>

        {isMine && !editing && (
          <>
            <ActionIcon variant="subtle" aria-label="Edit post" onClick={() => setEditing(true)}>
              <Pencil size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              aria-label="Delete post"
              color="red"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}>
              <Trash2 size={16} />
            </ActionIcon>
          </>
        )}
      </Group>
    </Card>
  );
}
