import { ExtendedFindConfig, FindConfig } from "@medusajs/types";
import { FindOperator, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder";
/**
 * Used to build TypeORM queries.
 * @param selector The selector
 * @param config The config
 * @return The QueryBuilderConfig
 */
export declare function buildQuery<TWhereKeys extends object, TEntity = unknown>(selector: TWhereKeys, config?: FindConfig<TEntity>): ExtendedFindConfig<TEntity>;
/**
 * Converts a typeorms structure of find options to an
 * array of string paths
 * @example
 * input: {
 *   test: {
 *     test1: true,
 *     test2: true,
 *     test3: {
 *       test4: true
 *     },
 *   },
 *   test2: true
 * }
 * output: ['test.test1', 'test.test2', 'test.test3.test4', 'test2']
 * @param input
 */
export declare function objectToStringPath<TEntity>(input?: FindOptionsWhere<TEntity> | FindOptionsSelect<TEntity> | FindOptionsOrder<TEntity> | FindOptionsRelations<TEntity>): (keyof TEntity)[];
export declare function buildSelects<TEntity>(selectCollection: string[]): FindOptionsSelect<TEntity>;
export declare function buildRelations<TEntity>(relationCollection: string[]): FindOptionsRelations<TEntity>;
export declare function addOrderToSelect<TEntity>(order: FindOptionsOrder<TEntity>, select: FindOptionsSelect<TEntity>): void;
export declare function nullableValue(value: any): FindOperator<any>;
