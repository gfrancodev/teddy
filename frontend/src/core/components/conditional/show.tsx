type ShowProps = {
  when: boolean | undefined | null;
  children: React.ReactNode;
};

export const Show = ({ when, children }: ShowProps) => {
  return when ? <>{children}</> : null;
}; 