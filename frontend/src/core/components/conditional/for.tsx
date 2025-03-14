type ForProps<T> = {
  each: T[] | undefined | null;
  children: (item: T, index: number) => React.ReactNode;
  empty?: React.ReactNode;
};

export function For<T>({ each, children, empty }: ForProps<T>) {
  if (!each || each.length === 0) {
    return empty ? <>{empty}</> : null;
  }

  return <>{each.map((item, index) => children(item, index))}</>;
}
