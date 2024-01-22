import { Grid, NumberInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { upperFirst } from '@mantine/hooks';

interface FormInputFieldsProps<T> {
  form: UseFormReturnType<T>;
  object: object;
  baseKey?: string;
  supportArrays?: boolean;
  supportObjects?: boolean;
  preview?: boolean;
}

/**
 * Formats the given name by splitting it on periods, adding spaces before capital letters,
 * removing trailing 's', and incrementing the last digit if it exists.
 * @param name - The name to be formatted.
 * @returns The formatted name.
 */
const formatName = (name: string) => {
  return name
    .split('.')
    .map((item) =>
      item
        .replace(/([A-Z])/g, ' $1')
        .replace(/s$/, '')
        .match(/\d$/)
        ? item.slice(0, item.length - 1) + (parseInt(item[item.length - 1], 10) + 1)
        : item.replace(/([A-Z])/g, ' $1').replace(/s$/, ''),
    )
    .join(' ');
};

/**
 * Renders the inputs for a form based on the provided props.
 *
 * @template T - The type of the form object.
 * @param props - The props containing the form, object, baseKey, supportArrays, supportObjects, and readOnly values.
 * @returns An array of JSX elements representing the rendered inputs.
 */
const renderInputs = <T extends object>(props: FormInputFieldsProps<T>) => {
  const { form, object, baseKey, supportArrays, supportObjects, preview } = props;
  const previewElement = (parentKey: string, key: string, value: string | number) => {
    return (
      <Grid key={parentKey}>
        <Grid.Col span={2}>
          <Text>{upperFirst(key)}</Text>
        </Grid.Col>
        <Grid.Col span={1}>
          <Text>:</Text>
        </Grid.Col>
        <Grid.Col span={9}>
          <Text px="lg" style={{ border: '1px solid #ccc' }}>
            {value || '-'}
          </Text>
        </Grid.Col>
      </Grid>
    );
  };

  const elements: JSX.Element[] = [];
  elements.push(
    ...Object.entries(object).flatMap(([key, value]) => {
      const parentKey = baseKey ? `${baseKey}.${key}` : key;

      if (supportArrays && Array.isArray(value)) {
        return value.flatMap((item, index) => {
          const childrenKey = `${parentKey}.${index}`;
          const name = formatName(childrenKey);
          const nameElement = (
            <Title order={5} key={childrenKey}>
              {upperFirst(name)}
            </Title>
          );
          const params: FormInputFieldsProps<T> = {
            form,
            object: item as object,
            baseKey: childrenKey,
            supportArrays,
            supportObjects,
            preview,
          };
          const data = renderInputs(params);
          return [nameElement, ...data];
        });
      }

      if (supportObjects && typeof value === 'object' && !Array.isArray(value)) {
        const name = formatName(parentKey);
        const nameElement = (
          <Title order={5} key={parentKey}>
            {upperFirst(name)}
          </Title>
        );
        const params: FormInputFieldsProps<T> = {
          form,
          object: value as object,
          baseKey: parentKey,
          supportArrays,
          supportObjects,
          preview,
        };
        const data = renderInputs(params);
        return [nameElement, ...data];
      }

      if (typeof value === 'number') {
        return preview ? (
          previewElement(parentKey, key, value)
        ) : (
          <NumberInput
            key={parentKey}
            name={key}
            label={upperFirst(key)}
            min={0}
            {...form.getInputProps(parentKey)}
          />
        );
      }

      if (typeof value === 'string') {
        return preview ? (
          previewElement(parentKey, key, value)
        ) : (
          <TextInput
            key={parentKey}
            name={key}
            label={upperFirst(key)}
            {...form.getInputProps(parentKey)}
          />
        );
      }

      return [];
    }),
  );

  return elements;
};

const FormInputFields = <T extends object>(props: FormInputFieldsProps<T>) => {
  return <Stack gap="md">{renderInputs(props)}</Stack>;
};

export default FormInputFields;
