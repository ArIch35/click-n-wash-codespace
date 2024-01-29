import { Anchor, Button, Divider, Group, Modal, ModalProps, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useMediaQuery, useToggle } from '@mantine/hooks';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import firebaseAuth from '../../firebase';
import { useAuth } from '../../providers/authentication/Authentication.Context';
import { showCustomNotification, showErrorNotification } from '../../utils/mantine-notifications';
import FormInputFields from '../ui/form-input-fields';
import { GoogleButton } from './GoogleButton';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const initialValues: FormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
};

export function AuthenticationForm({ ...props }: ModalProps) {
  const { setRegisteredName } = useAuth();
  const [type, toggle] = useToggle(['login', 'register']);
  const isMobile = useMediaQuery('(max-width: 50em)');
  const form = useForm({
    validateInputOnBlur: true,
    initialValues,
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length <= 6 && type === 'register'
          ? 'Password should have at least 6 characters'
          : null,
      confirmPassword: (value, values) =>
        value !== values.password && type === 'register' ? 'Passwords do not match' : null,
      terms: (val) => (type === 'register' && !val ? 'You must accept terms and conditions' : null),
    },
  });

  const onSubmit = (values: FormValues, e: React.FormEvent<HTMLFormElement> | undefined) => {
    e?.preventDefault();
    if (form.validate().hasErrors) {
      return;
    }
    if (type === 'login') {
      signInWithEmailAndPassword(firebaseAuth, values.email, values.password)
        .then((userCredential) => {
          props.onClose();
          showCustomNotification({
            title: `Welcome back ${userCredential.user?.displayName || userCredential.user.email}!`,
            message: 'You have been successfully logged in',
            color: 'green',
            autoClose: true,
          });
        })
        .catch((error) => showErrorNotification('User', 'login', String(error)));
      return;
    }
    setRegisteredName(values.name);
    createUserWithEmailAndPassword(firebaseAuth, values.email, values.password)
      .then(() => {
        props.onClose();
        showCustomNotification({
          title: 'Welcome',
          message: 'Your account has been created',
          color: 'green',
          autoClose: true,
        });
      })
      .catch((error) => showErrorNotification('User', 'register', String(error)));
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
        <GoogleButton
          radius="xl"
          onSuccessfulSignIn={(userCredential) => {
            showCustomNotification({
              title: `Welcome back ${
                userCredential.user?.displayName || userCredential.user.email
              }!`,
              message: 'You have been successfully logged in',
              color: 'green',
              autoClose: true,
            });
            props.onClose();
          }}
        >
          Google
        </GoogleButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(onSubmit)}>
        <FormInputFields
          form={form}
          values={form.values}
          hide={{
            name: type !== 'register',
            confirmPassword: type !== 'register',
            terms: type !== 'register',
          }}
          required={{
            email: true,
            password: true,
            confirmPassword: type === 'register',
            terms: type === 'register',
          }}
          label={{ terms: 'I accept terms and conditions' }}
        />

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
