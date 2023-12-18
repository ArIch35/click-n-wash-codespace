import { useToggle, upperFirst, useMediaQuery } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Group,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Modal,
  ModalProps,
} from '@mantine/core';
import { GoogleButton } from './GoogleButton';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseAuth from '../../firebase';
import { setUserId } from '../../reducers/notification.reducer';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../../reducers/authentication.reducer';

interface AuthenticationFormProps extends ModalProps {
  onSignInComplete: (email: string) => void;
}

export function AuthenticationForm({ onSignInComplete, ...props }: AuthenticationFormProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width: 50em)');
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  function onSuccessfulSignIn(user: User) {
    dispatch(setUserId(user.uid));
    user
      .getIdToken()
      .then((token) => {
        dispatch(setAuthToken(token));
      })
      .catch((error) => {
        console.error(error);
      });
    onSignInComplete(user.email!);
  }

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
        <GoogleButton radius="xl" onSuccessfulSignIn={onSuccessfulSignIn}>
          Google
        </GoogleButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {})}>
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
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register' ? 'Already have an account? Login' : 'Not a member yet? Register'}
          </Anchor>
          <Button
            type="submit"
            radius="xl"
            onClick={() => {
              if (type === 'login') {
                signInWithEmailAndPassword(firebaseAuth, form.values.email, form.values.password)
                  .then((result) => {
                    onSuccessfulSignIn(result.user);
                    console.log(result);
                  })
                  .catch((error) => {
                    console.error(error);
                  });
                return;
              }
              createUserWithEmailAndPassword(firebaseAuth, form.values.email, form.values.password)
                .then((result) => {
                  onSuccessfulSignIn(result.user);
                  console.log(result);
                })
                .catch((error) => {
                  console.error(error);
                });
            }}
          >
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
