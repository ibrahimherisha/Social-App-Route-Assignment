import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Container, Skeleton, Stack, Text, Title } from "@mantine/core";
import { getBookmarks } from "../../api/Users/api.ts";
import PostCard from "../../components/Posts/PostCard.tsx";

export default function Bookmarks() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: getBookmarks,
  });

  const posts = data?.data.posts ?? [];

  if (isPending) {
    return (
      <Container size={640} px="md">
        <Stack gap="md">
          <Skeleton height={160} radius="md" />
          <Skeleton height={160} radius="md" />
        </Stack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container size={640} px="md">
        <Alert color="red" title="Couldn't load your saved posts">
          <Button mt="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size={640} px="md">
      <Stack gap="md">
        <Title order={3}>Saved posts</Title>
        {posts.length === 0 ? (
          <Text c="dimmed">Nothing saved yet — tap the bookmark icon on any post to keep it here.</Text>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </Stack>
    </Container>
  );
}
