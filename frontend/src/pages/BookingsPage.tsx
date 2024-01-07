import { useEffect, useState } from 'react';
import Laundromat from '../interfaces/entities/laundromat';
import { getLaundromats, getWashingMachinesByLaundromatId } from '../utils/api-functions';
import BaseList from '../components/ui/BaseList.component';
import IndividualLaundromat from '../components/ui/IndividualLaundromat.component';
import WashingMachine from '../interfaces/entities/washing-machine';
import WashingMachinePicker from '../components/booking/WashingMachinePicker';

const BookingsPage = () => {
  const [allLaundromats, setAllLaundromats] = useState<Laundromat[]>([]);
  const [chosenWashingMachines, setChosenWashingMachines] = useState<WashingMachine[] | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const getWaschingMachinesFromLaundromat = (id: string) => {
    getWashingMachinesByLaundromatId(id)
      .then((laundromat: Laundromat) => {
        const washingMachines: WashingMachine[] | undefined = laundromat.washingMachines;
        setChosenWashingMachines(washingMachines!);
        setIsOpen(true);
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
    <div>
      {allLaundromats && (
        <BaseList
          items={allLaundromats}
          IndividualComponent={IndividualLaundromat}
          onItemClick={(item: Laundromat) => {
            getWaschingMachinesFromLaundromat(item.id);
          }}
        />
      )}
      {chosenWashingMachines && (
        <WashingMachinePicker
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          washingMachines={chosenWashingMachines}
        />
      )}
    </div>
  );
};

export default BookingsPage;
