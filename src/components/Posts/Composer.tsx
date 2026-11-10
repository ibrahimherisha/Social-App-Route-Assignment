import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, FileInput, Image, Stack, Textarea } from "@mantine/core";
import { createPost } from "../../api/Posts/api.ts";
import type { CreatePostReq } from "../../api/Posts/types.ts";

export default function Composer() {
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Live preview of the picked image, same pattern as the edit form.
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const createMutation = useMutation({
    mutationFn: (data: CreatePostReq) => createPost(data),
    onSuccess: () => {
      setBody("");
      setImage(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!body.trim()) return;
          createMutation.mutate({ body: body.trim(), image });
        }}>
        <Stack gap="sm">
          <Textarea
            placeholder="What's on your mind?"
            value={body}
            onChange={(e) => setBody(e.currentTarget.value)}
            autosize
            minRows={2}
          />
          <FileInput
            placeholder="Add an image (optional)"
            accept="image/*"
            value={image}
            onChange={setImage}
            clearable
          />
          {preview && <Image src={preview} alt="Image preview" className="post-image" />}
          <Button type="submit" loading={createMutation.isPending} disabled={!body.trim()} className="btn-gradient">
            Post
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
