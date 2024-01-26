import { List } from '@mantine/core';
import { IndividualComponent } from '../../interfaces/ui/individual';

interface BaseListProps<T> {
  items: T[];
  onItemClick?: (item: T) => void;
  onLocationClick?: (item: T) => void;
  IndividualComponent: IndividualComponent<T>;
}

const BaseList = <T,>({
  items,
  IndividualComponent,
  onItemClick,
  onLocationClick,
}: BaseListProps<T>) => {
  return (
    <List>
      {items.map((item, index) => (
        <IndividualComponent
          key={index}
          item={item}
          onItemClick={onItemClick}
          onLocationClick={onLocationClick}
        />
      ))}
    </List>
  );
};

export default BaseList;
