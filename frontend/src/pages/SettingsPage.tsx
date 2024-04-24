import { Button, Container, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import FormInputFields from '../components/ui/form-input-fields';
import firebaseAuth from '../firebase';
import { UpdateUser } from '../interfaces/entities/user';
import { useAuth } from '../providers/authentication/Authentication.Context';
import { updateUser } from '../utils/api';
import { showErrorNotification, showSuccessNotification } from '../utils/mantine-notifications';

type FormPassword = {
  oldPassword: string;
  newPassword: string;
};

const SettingsPage = () => {
  const { user } = useAuth();
  const firebaseUser = firebaseAuth.currentUser;
  const initialValuesFormUser: UpdateUser = {
    name: user?.name || '',
  };
  const initialValuesFormPassword: FormPassword = {
    oldPassword: '',
    newPassword: '',
  };

  const formUser = useForm<UpdateUser>({
    initialValues: initialValuesFormUser,
  });
  const formPassword = useForm<FormPassword>({
    initialValues: initialValuesFormPassword,
    validate: {
      newPassword: (value, values) =>
        value.length < 6
          ? 'Password should have at least 6 characters'
          : value === values.oldPassword
            ? 'New password cannot be the same as the old password'
            : null,
    },
  });

  const onSubmitFormUser = (values: UpdateUser, event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (formUser.validate().hasErrors) {
      return;
    }

    updateUser(values)
      .then((user) => {
        showSuccessNotification('Your name has been', 'update');
        formUser.setInitialValues({
          name: user.name,
        });
        formUser.reset();
      })
      .catch((error) => showErrorNotification('User', 'Update', JSON.stringify(error)));
  };

  const onSubmitFormPassword = (values: FormPassword, event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (formPassword.validate().hasErrors) {
      return;
    }

    if (!user || !firebaseUser) {
      throw new Error('User is not logged in!');
    }

    const credential = EmailAuthProvider.credential(user.email, values.oldPassword);
    reauthenticateWithCredential(firebaseUser, credential)
      .then(() => {
        updatePassword(firebaseUser, values.newPassword)
          .then(() => {
            showSuccessNotification('Your password has been', 'update');
            formPassword.reset();
          })
          .catch((error) => showErrorNotification('User', 'Update', JSON.stringify(error)));
      })
      .catch(() => showErrorNotification('User', 'Update', 'Wrong password'));
  };

  return (
    <Container mt="lg">
      <Stack>
        <form onSubmit={formUser.onSubmit(onSubmitFormUser)}>
          <FormInputFields form={formUser} values={formUser.values} />
          <Stack mt="lg">
            <Button type="submit">Update user</Button>
          </Stack>
        </form>
        {firebaseUser?.providerData[0].providerId === 'password' && (
          <form onSubmit={formPassword.onSubmit(onSubmitFormPassword)}>
            <FormInputFields form={formPassword} values={formPassword.values} />
            <Stack mt="lg">
              <Button type="submit">Update password</Button>
            </Stack>
          </form>
        )}
      </Stack>
    </Container>
  );
};

export default SettingsPage;
