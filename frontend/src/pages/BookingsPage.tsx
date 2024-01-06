import { useEffect, useState } from 'react';
import Laundromat from '../interfaces/entities/laundromat';
import { getLaundromats, getWashingMachinesByLaundromatId } from '../utils/api-functions';
import BaseList from '../components/ui/BaseList.component';
import IndividualLaundromat from '../components/ui/IndividualLaundromat.component';
import WashingMachine from '../interfaces/entities/washing-machine';

const BookingsPage = () => {
  const [allLaundromats, setAllLaundromats] = useState<Laundromat[]>([]);

  const getWM = (id: string) => {
    getWashingMachinesByLaundromatId(id)
      .then((laundromat: Laundromat) => {
        const washingMachines: WashingMachine[] | undefined = laundromat.washingMachines;
        console.log(washingMachines);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getLaundromats()
      .then((laundromats) => {
        setAllLaundromats(laundromats);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    allLaundromats && (
      <BaseList
        items={allLaundromats}
        IndividualComponent={IndividualLaundromat}
        onItemClick={(item: Laundromat) => {
          getWM(item.id);
        }}
      />
    )
  );
};

export default BookingsPage;
