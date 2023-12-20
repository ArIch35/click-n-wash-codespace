import { Anchor } from '@mantine/core';

interface AuthAnchorProps {
  link: { label: string };
  className?: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const AuthAnchor = ({ ...props }: AuthAnchorProps) => {
  return (
    <Anchor underline="hover" className={props.className} onClick={props.onClick}>
      {props.link.label}
    </Anchor>
  );
};

export default AuthAnchor;
