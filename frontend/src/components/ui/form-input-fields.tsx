import {
  Checkbox,
  Grid,
  NumberInput,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { upperFirst } from '@mantine/hooks';

interface FormInputFieldsProps<T> {
  form: UseFormReturnType<T>;
  values: object;
  baseKey?: string;
  supportArrays?: boolean;
  supportNested?: boolean;
  preview?: boolean;
  textArea?: Record<string, boolean>;
  hide?: Record<string, boolean>;
  required?: Record<string, boolean>;
  label?: Record<string, string>;
  placeholder?: Record<string, string>;
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
 * Renders the input fields based on the provided props.
 *
 * @template T - The type of the object containing the input fields.
 * @param {FormInputFieldsProps<T>} props - The props containing the configuration for rendering the input fields.
 * @returns An array of JSX elements representing the rendered input fields.
 */
const renderInputs = <T extends object>(props: FormInputFieldsProps<T>) => {
  const previewElement = (parentKey: string, key: string, value: string | number | boolean) => {
    return (
      <Grid key={parentKey}>
        <Grid.Col span={2}>
          <Text>
            {props.label?.[parentKey] || props.label?.[key] || upperFirst(formatName(key))}
          </Text>
        </Grid.Col>
        <Grid.Col span={1}>
          <Text>:</Text>
        </Grid.Col>
        <Grid.Col span={9}>
          <Text px="lg">
            {typeof value === 'boolean'
              ? value
              : (key === 'password' ? '*'.repeat((value as string).length) : value) || '-'}
          </Text>
        </Grid.Col>
      </Grid>
    );
  };

  const elements: JSX.Element[] = [];
  elements.push(
    ...Object.entries(props.values).flatMap(([key, value]) => {
      const parentKey = props.baseKey ? `${props.baseKey}.${key}` : key;

      if (props.hide?.[parentKey]) {
        return [];
      }

      if (props.supportArrays && Array.isArray(value)) {
        return value.flatMap((item, index) => {
          const childrenKey = `${parentKey}.${index}`;
          const name = formatName(childrenKey);
          const nameElement = (
            <Title order={5} key={childrenKey}>
              {upperFirst(name)}
            </Title>
          );
          const params: FormInputFieldsProps<T> = {
            ...props,
            values: item as object,
            baseKey: childrenKey,
          };
          const data = renderInputs(params);
          return [nameElement, ...data];
        });
      }

      if (props.supportNested && typeof value === 'object' && !Array.isArray(value)) {
        const name = formatName(parentKey);
        const nameElement = (
          <Title order={5} key={parentKey}>
            {upperFirst(name)}
          </Title>
        );
        const params: FormInputFieldsProps<T> = {
          ...props,
          values: value as object,
          baseKey: parentKey,
        };
        const data = renderInputs(params);
        return [nameElement, ...data];
      }

      if (typeof value === 'number') {
        return props.preview ? (
          previewElement(parentKey, key, value)
        ) : (
          <NumberInput
            key={parentKey}
            name={key}
            label={props.label?.[parentKey] || props.label?.[key] || upperFirst(formatName(key))}
            required={props.required?.[parentKey]}
            placeholder={props.placeholder?.[parentKey]}
            min={0}
            {...props.form.getInputProps(parentKey)}
            onChange={(value) => {
              if (value === '') {
                props.form.setFieldValue(
                  parentKey,
                  0 as string extends keyof T ? T[keyof T & string] : unknown,
                );
                return;
              }
              props.form.setFieldValue(
                parentKey,
                value as string extends keyof T ? T[keyof T & string] : unknown,
              );
            }}
          />
        );
      }

      if (typeof value === 'boolean') {
        return props.preview ? (
          previewElement(parentKey, key, value)
        ) : (
          <Checkbox
            key={parentKey}
            name={key}
            label={props.label?.[parentKey] || props.label?.[key] || upperFirst(formatName(key))}
            required={props.required?.[parentKey]}
            placeholder={props.placeholder?.[parentKey]}
            {...props.form.getInputProps(parentKey)}
          />
        );
      }

      if (typeof value === 'string') {
        return props.preview ? (
          previewElement(parentKey, key, value)
        ) : props.textArea?.[parentKey] ? (
          <Textarea
            key={parentKey}
            name={key}
            label={props.label?.[parentKey] || props.label?.[key] || upperFirst(formatName(key))}
            required={props.required?.[parentKey]}
            placeholder={props.placeholder?.[parentKey]}
            autosize
            minRows={5}
            maxRows={10}
            {...props.form.getInputProps(parentKey)}
          />
        ) : key.toLocaleLowerCase().includes('password') ? (
          <PasswordInput
            key={parentKey}
            name={key}
            label={props.label?.[parentKey] || props.label?.[key] || upperFirst(formatName(key))}
            required={props.required?.[parentKey]}
            placeholder={props.placeholder?.[parentKey]}
            {...props.form.getInputProps(parentKey)}
          />
        ) : (
          <TextInput
            key={parentKey}
            name={key}
            label={props.label?.[parentKey] || props.label?.[key] || upperFirst(formatName(key))}
            required={props.required?.[parentKey]}
            placeholder={props.placeholder?.[parentKey]}
            {...props.form.getInputProps(parentKey)}
          />
        );
      }

      return [];
    }),
  );

  return elements;
};

/**
 * Renders a stack of form input fields.
 *
 * @template T - The type of the form data object.
 * @param {FormInputFieldsProps<T>} props - The props for the form input fields.
 * @param {UseFormReturnType<T>} props.form - The form object.
 * @param {object} props.values - The values for the form input fields.
 * @param {string} [props.baseKey] - The base key for the form input fields.
 * @param {boolean} [props.supportArrays] - Whether to support arrays.
 * @param {boolean} [props.supportNested] - Whether to support nested objects.
 * @param {boolean} [props.preview] - Whether to render the form input fields in preview mode.
 * @param {Record<string, boolean>} [props.textArea] - Keys that should be rendered as text areas.
 * @param {Record<string, boolean>} [props.hide] - Keys that should be hidden.
 * @param {Record<string, boolean>} [props.required] - Keys that should be required.
 * @param {Record<string, string>} [props.label] - The labels for the form input fields.
 * @param {Record<string, string>} [props.placeholder] - The placeholders for the form input fields.
 * @returns {JSX.Element} - The rendered stack of form input fields.
 */
const FormInputFields = <T extends object>(props: FormInputFieldsProps<T>) => {
  return <Stack gap="md">{renderInputs(props)}</Stack>;
};

export default FormInputFields;
