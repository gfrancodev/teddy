type ElseProps = {
  condition: boolean;
  children: React.ReactNode;
  fallback: React.ReactNode;
};

export const Else = ({ condition, children, fallback }: ElseProps) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};
