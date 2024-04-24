export interface Individual<T> {
  item: T;
  onItemClick?: (item: T) => void;
  onLocationClick?: (item: T) => void;
}

export type IndividualComponent<T> = React.FC<Individual<T>>;
