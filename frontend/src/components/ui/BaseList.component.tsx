import { List } from '@mantine/core';
import { IndividualComponent } from '../../interfaces/ui/individual';

interface BaseListProps<T> {
  items: T[];
  onItemClick?: (item: T) => void;
  IndividualComponent: IndividualComponent<T>;
}

const BaseList = <T,>({ items, IndividualComponent, onItemClick }: BaseListProps<T>) => {
  return (
    <List>
      {items.map((item, index) => (
        <IndividualComponent key={index} item={item} onItemClick={onItemClick} />
      ))}
    </List>
  );
};

export default BaseList;
