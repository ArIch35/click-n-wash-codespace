import { Center, Image, Title, Text, Button, Container, Grid } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const MissingPage = () => {
  const navigate = useNavigate();

  return (
    <Container p={1}>
      <Center>
        <Grid>
          <Grid.Col>
            {' '}
            <Image
              src="https://ui.mantine.dev/_next/static/media/image.11cd6c19.svg"
              alt="404 Image"
            />
          </Grid.Col>
          <Grid.Col>
            <Title>Sorry, we can&apos;t find that page</Title>
            <Text size="lg">
              Uh-oh! The page you&apos;re hunting for seems to have gone on a digital scavenger
              hunt. Double-check the address, or contact support if you suspect some mischief afoot!
            </Text>
            <Button variant="outline" size="md" mt="xl" onClick={() => navigate('/')}>
              Get back to home page
            </Button>
          </Grid.Col>
        </Grid>
      </Center>
    </Container>
  );
};

export default MissingPage;
