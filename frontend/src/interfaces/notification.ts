interface Notification {
  id?: string;
  title: string;
  message: string;
  color: string;
  autoClose: boolean;
  icon?: React.ReactNode;
}

export default Notification;
