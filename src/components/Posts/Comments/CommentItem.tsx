import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ActionIcon, Avatar, Button, Card, Group, Image, Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Heart, Pencil, Trash2 } from "lucide-react";
import type { Comment } from "../../../api/Posts/Comments/types.ts";
import { deleteComment, likeComment, updateComment } from "../../../api/Posts/Comments/api.ts";
import { useAuth } from "../../../context/useAuth.ts";

const LIKED_COLOR = "#fb4d6d";

export default function CommentItem({
  comment,
  postId,
  postOwnerId,
}: {
  comment: Comment;
  postId: string;
  postOwnerId: string;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);

  const isMine = user?._id === comment.commentCreator._id;
  // The API lets the comment owner OR the post owner delete a comment.
  const canDelete = isMine || user?._id === postOwnerId;
  const liked = user ? (comment.likes ?? []).includes(user._id) : false;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    queryClient.invalidateQueries({ queryKey: ["post", postId] });
  };

  const likeMutation = useMutation({
    mutationFn: () => likeComment(postId, comment._id),
    onSuccess: refresh,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(postId, comment._id),
    onSuccess: refresh,
  });

  const updateMutation = useMutation({
    mutationFn: (content: string) => updateComment(postId, comment._id, { content }),
    onSuccess: () => {
      setEditing(false);
      refresh();
    },
  });

  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Delete this comment?",
      children: <Text size="sm">This can&apos;t be undone.</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteMutation.mutate(),
    });
  };

  return (
    <Card padding="md">
      <Group gap="sm" mb="xs">
        <Avatar src={comment.commentCreator.photo} alt={comment.commentCreator.name} radius="xl" size="sm">
          {comment.commentCreator.name[0]}
        </Avatar>
        <div>
          <Text fw={700} size="sm" className="font-display">
            {comment.commentCreator.name}
          </Text>
          <Text size="xs" c="dimmed">
            {new Date(comment.createdAt).toLocaleString()}
          </Text>
        </div>
      </Group>

      {editing ? (
        <>
        <Group gap="xs" align="flex-end">
          <TextInput value={draft} onChange={(e) => setDraft(e.currentTarget.value)} style={{ flex: 1 }} />
          <Button
            size="xs"
            className="btn-gradient"
            loading={updateMutation.isPending}
            disabled={!draft.trim()}
            onClick={() => updateMutation.mutate(draft.trim())}>
            Save
          </Button>
          <Button
            size="xs"
            variant="subtle"
            onClick={() => {
              setEditing(false);
              setDraft(comment.content);
            }}>
            Cancel
          </Button>
        </Group>
          {updateMutation.isError && (
            <Text c="red" size="sm">
              Couldn&apos;t save — try again.
            </Text>
          )}
        </>
      ) : (
        <>
          <Text size="sm">{comment.content}</Text>
          {comment.image && <Image src={comment.image} alt="Comment image" radius="md" mt="xs" />}
        </>
      )}

      <Group gap="xs" mt="sm">
        <ActionIcon
          variant="subtle"
          aria-label="Like comment"
          aria-pressed={liked}
          disabled={likeMutation.isPending}
          onClick={() => likeMutation.mutate()}>
          <Heart size={16} color={liked ? LIKED_COLOR : undefined} fill={liked ? LIKED_COLOR : "none"} />
        </ActionIcon>
        <Text size="sm">{(comment.likes ?? []).length}</Text>
        {isMine && !editing && (
          <ActionIcon variant="subtle" aria-label="Edit comment" onClick={() => setEditing(true)}>
            <Pencil size={16} />
          </ActionIcon>
        )}
        {canDelete && (
          <ActionIcon
            variant="subtle"
            aria-label="Delete comment"
            color="red"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}>
            <Trash2 size={16} />
          </ActionIcon>
        )}
      </Group>
    </Card>
  );
}
