import React from 'react';
import { IconReceiptOff } from '@tabler/icons-react';
import { Box, Container, Flex, Text } from '@mantine/core';

interface EmptyDataProps {
  message: string;
}

const EmptyData: React.FC<EmptyDataProps> = ({ message }) => {
  return (
    <Container>
      <Box p="lg" style={{ width: '100%' }}>
        <Flex direction="column" align="center">
          <IconReceiptOff size={30} />
          <Text>No Entry For {message} Found</Text>
        </Flex>
      </Box>
    </Container>
  );
};

export default EmptyData;
