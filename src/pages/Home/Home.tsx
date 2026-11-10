import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Alert, Button, Container, SegmentedControl, Skeleton, Stack, Text } from "@mantine/core";
import { getAllPosts, getFeed } from "../../api/Posts/api.ts";
import type { FeedFilter } from "../../api/Posts/types.ts";
import PostCard from "../../components/Posts/PostCard.tsx";
import Composer from "../../components/Posts/Composer.tsx";

const PAGE_SIZE = 10;

export default function Home() {
  const [filter, setFilter] = useState<FeedFilter>("all");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data, isPending, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", filter],
      queryFn: ({ pageParam }) =>
        filter === "all" ? getAllPosts(pageParam, PAGE_SIZE) : getFeed(filter, pageParam, PAGE_SIZE),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const p = lastPage.meta?.pagination;
        if (!p || p.currentPage >= p.numberOfPages) return undefined;
        return p.nextPage ?? p.currentPage + 1;
      },
    });

  // All loaded pages, flattened into one list.
  const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];

  // Infinite scroll: when the empty sentinel div at the bottom of the feed
  // becomes visible, load the next page. No extra library needed — the
  // browser's IntersectionObserver does the watching.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <Container size={640} px="md">
        <Stack gap="md">
          <Skeleton height={160} radius="md" />
          <Skeleton height={160} radius="md" />
          <Skeleton height={160} radius="md" />
        </Stack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container size={640} px="md">
        <Alert color="red" title="Couldn't load the posts">
          <Text size="sm" mb="sm">
            Check your connection and try again.
          </Text>
          <Button onClick={() => refetch()}>Retry</Button>
        </Alert>
      </Container>
    );
  }

  if (posts.length === 0) {
    return (
      <Container size={640} px="md">
        <Text ta="center" c="dimmed" mt="xl">
          No posts yet — be the first to share something.
        </Text>
      </Container>
    );
  }

  return (
    <Container size={640} px="md">
      <Stack gap="md">
        <SegmentedControl
          fullWidth
          value={filter}
          onChange={(value) => setFilter(value as FeedFilter)}
          data={[
            { label: "All", value: "all" },
            { label: "Following", value: "following" },
            { label: "My posts", value: "me" },
          ]}
        />
        <Composer />
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
        <div ref={sentinelRef} />
        {isFetchingNextPage && <Skeleton height={160} radius="md" />}
        {!hasNextPage && (
          <Text ta="center" c="dimmed" size="sm">
            You&apos;re all caught up.
          </Text>
        )}
      </Stack>
    </Container>
  );
}
