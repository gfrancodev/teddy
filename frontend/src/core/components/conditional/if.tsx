export const If = ({
  condition,
  children,
}: {
  condition: boolean;
  children: React.ReactNode;
}) => {
  return condition ? <>{children}</> : null;
};
