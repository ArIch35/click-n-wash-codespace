import BaseLayout from "../layout/BaseLayout";
import { Button } from "@mantine/core";

const HomePage = () => {
  return (
    <BaseLayout>
      <Button w={'100vw'} onClick={(event) =>{
          event.preventDefault();
          console.log('clicked')
        }}>
        Click n' Wash
      </Button>

    </BaseLayout>
  );
};

export default HomePage;
