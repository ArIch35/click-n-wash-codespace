import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Modal,
  ModalProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useMediaQuery, useToggle } from '@mantine/hooks';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { useDispatch } from 'react-redux';
import firebaseAuth from '../../firebase';
import { setRegisteredName } from '../../reducers/authentication.reducer';
import { GoogleButton } from './GoogleButton';

interface FormValues {
  email: string;
  name: string;
  password: string;
  terms: boolean;
}

const initialValues: FormValues = {
  email: '',
  name: '',
  password: '',
  terms: false,
};

export function AuthenticationForm({ ...props }: ModalProps) {
  const dispatch = useDispatch();
  const [type, toggle] = useToggle(['login', 'register']);
  const isMobile = useMediaQuery('(max-width: 50em)');
  const form = useForm({
    initialValues,
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length <= 6 && type === 'register'
          ? 'Password should include at least 6 characters'
          : null,
      terms: (val) => (type === 'register' && !val ? 'You must accept terms and conditions' : null),
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (type === 'login') {
      signInWithEmailAndPassword(firebaseAuth, values.email, values.password).catch((error) =>
        console.error(error),
      );
      return;
    }
    dispatch(setRegisteredName(values.name));
    createUserWithEmailAndPassword(firebaseAuth, values.email, values.password).catch((error) =>
      console.error(error),
    );
  };

  React.useEffect(() => {
    if (!props.opened) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.opened]);

  return (
    <Modal
      withCloseButton={isMobile}
      fullScreen={isMobile}
      transitionProps={{ transition: 'fade', duration: 200 }}
      centered
      radius={isMobile ? 0 : 'md'}
      {...props}
    >
      <Text size="lg" fw={500}>
        Welcome to Click n&apos; Wash, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl" onSuccessfulSignIn={() => props.onClose()}>
          Google
        </GoogleButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === 'register' && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password}
            radius="md"
          />

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              error={form.errors.terms}
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register' ? 'Already have an account? Login' : 'Not a member yet? Register'}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
