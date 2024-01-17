import { Button, Container, Group, NumberInput, Stepper, TextInput, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCircleCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLaundromat, createWashingMachine } from '../utils/api';

interface initLaundromat {
  name: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
  price: number;
}

const initialLaundromatValues: initLaundromat = {
  name: '',
  street: '',
  city: '',
  country: '',
  postalCode: '',
  price: 0,
};

interface initWashingMachine {
  name: string;
  brand: string;
  description: string;
}

const initialWashingMachineValues: initWashingMachine = {
  name: '',
  brand: '',
  description: '',
};

const LaundromatAddPage = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const LaundromatForm = useForm({
    initialValues: initialLaundromatValues,
  });

  const WashingMachineForm = useForm({
    initialValues: initialWashingMachineValues,
  });

  const onSubmit = async () => {
    const laundromat = await createLaundromat(LaundromatForm.values);
    await createWashingMachine({ ...WashingMachineForm.values, laundromat: laundromat.id });
  };

  const nextStep = () =>
    setActive((current) => {
      if (LaundromatForm.validate().hasErrors) {
        return current;
      }
      current === 2 &&
        onSubmit()
          .then(() => navigate('/manage-laundromats'))
          .catch((err) => console.log(err));
      return current < 3 ? current + 1 : current;
    });

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Container py={30}>
      <Stepper
        active={active}
        completedIcon={<IconCircleCheck style={{ width: rem(18), height: rem(18) }} />}
      >
        <Stepper.Step label="First step" description="Laundramat Profile">
          <form>
            {Object.keys(LaundromatForm.values).map((key, index) =>
              index === Object.keys(LaundromatForm.values).length - 1 ? null : typeof LaundromatForm
                  .values[key as keyof initLaundromat] === 'number' ? (
                <NumberInput
                  key={key}
                  name={key}
                  label={key}
                  {...LaundromatForm.getInputProps(key)}
                />
              ) : (
                <TextInput
                  key={key}
                  name={key}
                  label={key}
                  {...LaundromatForm.getInputProps(key)}
                />
              ),
            )}
          </form>
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Washing Mashine">
          <form>
            {Object.keys(WashingMachineForm.values).map((key) => (
              <TextInput
                key={key}
                name={key}
                label={key}
                {...WashingMachineForm.getInputProps(key)}
              />
            ))}
          </form>
        </Stepper.Step>
        <Stepper.Step label="Third step" description="Preview"></Stepper.Step>
      </Stepper>
      <Group justify="flex-end" mt="xl">
        {active !== 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active < 2 && <Button onClick={nextStep}>Next step</Button>}
        {active === 2 && <Button onClick={nextStep}>Submit</Button>}
      </Group>
    </Container>
  );
};

export default LaundromatAddPage;
