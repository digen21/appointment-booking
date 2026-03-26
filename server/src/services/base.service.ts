import {
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  SaveOptions,
  Types,
  UpdateQuery,
} from "mongoose";

type Where<T> = Partial<Record<keyof T, unknown>>;

export class BaseRepository<T> {
  constructor(protected model: Model<T>) {}

  find(
    where: Where<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.find(where, projection, options);
  }

  findOne(
    where: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.findOne(where, projection, options);
  }

  create(data: Partial<T>, options?: SaveOptions) {
    const doc = new this.model(data);
    return doc.save(options);
  }

  update(
    query: QueryFilter<T>,
    data: UpdateQuery<T>,
    options?: QueryOptions<T> | null,
  ) {
    return this.model.findOneAndUpdate(query, data, {
      ...options,
      runValidators: true,
      context: "query",
      new: true,
    });
  }

  delete(query: Where<T>, options?: QueryOptions<T>) {
    return this.model.findOneAndDelete(query, options);
  }

  findOneAndUpdate(
    query?: QueryFilter<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions<T> | null,
  ) {
    return this.model.findOneAndUpdate(query, update, options);
  }

  count(query: QueryFilter<T>) {
    return this.model.countDocuments(query);
  }

  findById(
    id: string | Types.ObjectId,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.findById(id, projection, options);
  }
}
