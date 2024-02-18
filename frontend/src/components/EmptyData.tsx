import React from 'react';
import { IconReceiptOff } from '@tabler/icons-react';
import { Card, Container, Flex, Text } from '@mantine/core';

interface EmptyDataProps {
  message: string;
}

const EmptyData: React.FC<EmptyDataProps> = ({ message }) => {
  return (
    <Container>
      <Card shadow="sm" padding="lg" radius="lg" style={{ width: '100%' }}>
        <Flex direction="column" align="center">
          <IconReceiptOff size={30} />
          <Text>No Entry For {message} Found</Text>
        </Flex>
      </Card>
    </Container>
  );
};

export default EmptyData;
