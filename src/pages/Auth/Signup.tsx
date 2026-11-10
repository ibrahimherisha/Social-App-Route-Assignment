import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { isAxiosError } from "axios";
import { useAuth } from "../../context/useAuth.ts";
import { RegisterSchema, type RegisterFormData } from "../../api/Auth/schema.ts";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: { gender: "male" },
    resolver: zodResolver(RegisterSchema),
    mode: "onTouched",
  });

  async function handleRegister(values: RegisterFormData) {
    try {
      setError(null);
      await signup(values);
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
          Create your account
        </Title>

        {error && (
          <Alert color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleRegister)}>
          <Stack>
            <TextInput label="Name" placeholder="Enter your name" {...register("name")} error={errors.name?.message} />
            <TextInput
              label="Username"
              placeholder="Enter your username"
              {...register("username")}
              error={errors.username?.message}
            />
            <TextInput
              label="Email"
              placeholder="Enter your email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
            />
            <TextInput
              label="Date of birth"
              type="date"
              {...register("dateOfBirth")}
              error={errors.dateOfBirth?.message}
            />
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Radio.Group
                  label="Gender"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.gender?.message}>
                  <Group mt="xs">
                    <Radio value="male" label="Male" />
                    <Radio value="female" label="Female" />
                  </Group>
                </Radio.Group>
              )}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              {...register("password")}
              error={errors.password?.message}
            />
            <PasswordInput
              label="Re-password"
              placeholder="Repeat your password"
              {...register("rePassword")}
              error={errors.rePassword?.message}
            />
            <Button type="submit" loading={isSubmitting} fullWidth className="btn-gradient">
              Sign up
            </Button>
            <Text ta="center" size="sm">
              Already have an account? <Link to="/login">Log in</Link>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
