import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useAuth } from "../../context/useAuth";
import { LoginSchema, type LoginFormData } from "../../api/Auth/schema.ts";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
  });

  async function handleLogin(values: LoginFormData) {
    try {
      setError(null);
      await login(values);
      navigate("/");
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
  }

  return (
    <Container size="xs" py="xl">
      <Paper shadow="md" radius="lg" p="xl">
        <Title order={2} ta="center" mb="md">
          Welcome back
        </Title>

        {error && (
          <Alert color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleLogin)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              {...register("password")}
              error={errors.password?.message}
            />
            <Button type="submit" loading={isSubmitting} fullWidth className="btn-gradient">
              Log in
            </Button>
            <Text ta="center" size="sm">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
