import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { Alert, Avatar, Button, Card, Container, Group, PasswordInput, Skeleton, Stack, Text, Title } from "@mantine/core";
import { getProfile } from "../../api/Profile/api.ts";
import { getUserPosts } from "../../api/Users/api.ts";
import { ChangePasswordSchema, type ChangePasswordFormData } from "../../api/Auth/schema.ts";
import { useAuth } from "../../context/useAuth.ts";
import PostCard from "../../components/Posts/PostCard.tsx";

export default function Profile() {
  const { changePassword } = useAuth();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const user = profileQuery.data?.data;

  const postsQuery = useQuery({
    queryKey: ["userPosts", user?._id],
    queryFn: () => getUserPosts(user!._id),
    enabled: !!user?._id,
  });
  const posts = postsQuery.data?.data.posts ?? [];

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({ resolver: zodResolver(ChangePasswordSchema) });

  const onSubmit = async (values: ChangePasswordFormData) => {
    setError(null);
    setSuccess(null);
    try {
      await changePassword(values);
      setSuccess("Password changed. You're still logged in.");
      reset();
    } catch (err) {
      setError(isAxiosError(err) ? (err.response?.data?.message ?? err.message) : "Something went wrong.");
    }
  };

  if (profileQuery.isPending) {
    return (
      <Container size={640} px="md">
        <Stack gap="md">
          <Skeleton height={120} radius="md" />
          <Skeleton height={200} radius="md" />
        </Stack>
      </Container>
    );
  }

  if (profileQuery.isError || !user) {
    return (
      <Container size={640} px="md">
        <Alert color="red" title="Couldn't load your profile">
          <Button mt="sm" onClick={() => profileQuery.refetch()}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size={640} px="md">
      <Stack gap="md">
        <Card p={0} className="hero-card">
          <div className="profile-cover">
            {user.cover && <img src={user.cover} alt="" className="profile-cover-photo" />}
          </div>
          <div className="hero-body">
            <div className="hero-top">
              <Group gap="md" align="flex-end">
                <div className="av-ring hero">
                  <Avatar src={user.photo} alt={user.name} radius="xl" size={104}>
                    {user.name?.[0] ?? "?"}
                  </Avatar>
                </div>
                <div style={{ paddingBottom: 4 }}>
                  <Title order={3} className="font-display">
                    {user.name}
                  </Title>
                  <Text c="dimmed">@{user.username}</Text>
                  {user.email && (
                    <Text size="sm" c="dimmed">
                      {user.email}
                    </Text>
                  )}
                </div>
              </Group>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <Title order={4} mb="sm">
            Change password
          </Title>
          {success && (
            <Alert color="green" mb="sm">
              {success}
            </Alert>
          )}
          {error && (
            <Alert color="red" mb="sm">
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="sm">
              <PasswordInput
                label="Current password"
                placeholder="Your current password"
                error={errors.password?.message}
                {...register("password")}
              />
              <PasswordInput
                label="New password"
                placeholder="At least 8 characters, upper + lower + number + special"
                error={errors.newPassword?.message}
                {...register("newPassword")}
              />
              <PasswordInput
                label="Confirm new password"
                placeholder="Repeat the new password"
                error={errors.rePassword?.message}
                {...register("rePassword")}
              />
              <Button type="submit" loading={isSubmitting} className="btn-gradient">
                Change password
              </Button>
            </Stack>
          </form>
        </Card>

        <Title order={4}>My posts ({posts.length})</Title>
        {postsQuery.isPending ? (
          <Skeleton height={160} radius="md" />
        ) : posts.length === 0 ? (
          <Text c="dimmed">You haven&apos;t posted anything yet.</Text>
        ) : (
          <Stack gap="md">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
