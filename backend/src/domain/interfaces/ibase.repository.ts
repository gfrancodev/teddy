export interface IBaseRepository<T> {
  create(entity: Partial<T>): Promise<T>;
  update(id: string | number, entity: Partial<T>): Promise<T>;
  updateOne(filter: Partial<T>, entity: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<void>;
  findOne(options: Partial<T>): Promise<T | null>;
  findById(id: string | number): Promise<T | null>;
}
