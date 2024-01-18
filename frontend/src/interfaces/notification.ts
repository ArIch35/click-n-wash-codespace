interface Notification {
  id?: string;
  title: string;
  message: string;
  color: string;
  autoClose: boolean;
  vendor?: boolean;
}

export default Notification;
