"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyOrdering = exports.mergeEntitiesWithRelations = exports.getGroupedRelations = exports.queryEntityWithoutRelations = exports.queryEntityWithIds = void 0;
var lodash_1 = require("lodash");
/**
 * Custom query entity, it is part of the creation of a custom findWithRelationsAndCount needs.
 * Allow to query the relations for the specified entity ids
 * @param repository
 * @param entityIds
 * @param groupedRelations
 * @param withDeleted
 * @param select
 * @param customJoinBuilders
 */
function queryEntityWithIds(repository, entityIds, groupedRelations, withDeleted, select, customJoinBuilders) {
    if (withDeleted === void 0) { withDeleted = false; }
    if (select === void 0) { select = []; }
    if (customJoinBuilders === void 0) { customJoinBuilders = []; }
    return __awaiter(this, void 0, void 0, function () {
        var alias;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    alias = repository.metadata.name.toLowerCase();
                    return [4 /*yield*/, Promise.all(Object.entries(groupedRelations).map(function (_a) {
                            var _b = __read(_a, 2), toplevel = _b[0], rels = _b[1];
                            return __awaiter(_this, void 0, void 0, function () {
                                var querybuilder, shouldAttachDefault, customJoinBuilders_1, customJoinBuilders_1_1, customJoinBuilder, result, rels_1, rels_1_1, rel, _c, _1, rest;
                                var e_1, _d, e_2, _e;
                                return __generator(this, function (_f) {
                                    querybuilder = repository.createQueryBuilder(alias);
                                    if (select && select.length) {
                                        querybuilder.select(select.map(function (f) { return "".concat(alias, ".").concat(f); }));
                                    }
                                    shouldAttachDefault = true;
                                    try {
                                        for (customJoinBuilders_1 = __values(customJoinBuilders), customJoinBuilders_1_1 = customJoinBuilders_1.next(); !customJoinBuilders_1_1.done; customJoinBuilders_1_1 = customJoinBuilders_1.next()) {
                                            customJoinBuilder = customJoinBuilders_1_1.value;
                                            result = customJoinBuilder(querybuilder, alias, toplevel);
                                            shouldAttachDefault = shouldAttachDefault && result;
                                        }
                                    }
                                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                    finally {
                                        try {
                                            if (customJoinBuilders_1_1 && !customJoinBuilders_1_1.done && (_d = customJoinBuilders_1.return)) _d.call(customJoinBuilders_1);
                                        }
                                        finally { if (e_1) throw e_1.error; }
                                    }
                                    // If the toplevel relation has been attached with a customJoinBuilder and the function return false then
                                    // do not attach the toplevel join bellow.
                                    if (shouldAttachDefault) {
                                        querybuilder = querybuilder.leftJoinAndSelect("".concat(alias, ".").concat(toplevel), toplevel);
                                    }
                                    try {
                                        for (rels_1 = __values(rels), rels_1_1 = rels_1.next(); !rels_1_1.done; rels_1_1 = rels_1.next()) {
                                            rel = rels_1_1.value;
                                            _c = __read(rel.split("."), 2), _1 = _c[0], rest = _c[1];
                                            if (!rest) {
                                                continue;
                                            }
                                            // Regex matches all '.' except the rightmost
                                            querybuilder = querybuilder.leftJoinAndSelect(rel.replace(/\.(?=[^.]*\.)/g, "__"), rel.replace(".", "__"));
                                        }
                                    }
                                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                    finally {
                                        try {
                                            if (rels_1_1 && !rels_1_1.done && (_e = rels_1.return)) _e.call(rels_1);
                                        }
                                        finally { if (e_2) throw e_2.error; }
                                    }
                                    if (withDeleted) {
                                        querybuilder = querybuilder
                                            .where("".concat(alias, ".id IN (:...entitiesIds)"), {
                                            entitiesIds: entityIds,
                                        })
                                            .withDeleted();
                                    }
                                    else {
                                        querybuilder = querybuilder.where("".concat(alias, ".deleted_at IS NULL AND ").concat(alias, ".id IN (:...entitiesIds)"), {
                                            entitiesIds: entityIds,
                                        });
                                    }
                                    return [2 /*return*/, querybuilder.getMany()];
                                });
                            });
                        })).then(lodash_1.flatten)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.queryEntityWithIds = queryEntityWithIds;
/**
 * Custom query entity without relations, it is part of the creation of a custom findWithRelationsAndCount needs.
 * Allow to query the entities without taking into account the relations. The relations will be queried separately
 * using the queryEntityWithIds util
 * @param repository
 * @param optionsWithoutRelations
 * @param shouldCount
 * @param customJoinBuilders
 */
function queryEntityWithoutRelations(repository, optionsWithoutRelations, shouldCount, customJoinBuilders) {
    if (shouldCount === void 0) { shouldCount = false; }
    if (customJoinBuilders === void 0) { customJoinBuilders = []; }
    return __awaiter(this, void 0, void 0, function () {
        var alias, qb, toSelect_1, parsed, customJoinBuilders_2, customJoinBuilders_2_1, customJoinBuilder, entities, count, result;
        var e_3, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    alias = repository.metadata.name.toLowerCase();
                    qb = repository
                        .createQueryBuilder(alias)
                        .select(["".concat(alias, ".id")])
                        .skip(optionsWithoutRelations.skip)
                        .take(optionsWithoutRelations.take);
                    if (optionsWithoutRelations.where) {
                        qb.where(optionsWithoutRelations.where);
                    }
                    if (optionsWithoutRelations.order) {
                        toSelect_1 = [];
                        parsed = Object.entries(optionsWithoutRelations.order).reduce(function (acc, _a) {
                            var _b = __read(_a, 2), k = _b[0], v = _b[1];
                            var key = "".concat(alias, ".").concat(k);
                            toSelect_1.push(key);
                            acc[key] = v;
                            return acc;
                        }, {});
                        qb.addSelect(toSelect_1);
                        qb.orderBy(parsed);
                    }
                    try {
                        for (customJoinBuilders_2 = __values(customJoinBuilders), customJoinBuilders_2_1 = customJoinBuilders_2.next(); !customJoinBuilders_2_1.done; customJoinBuilders_2_1 = customJoinBuilders_2.next()) {
                            customJoinBuilder = customJoinBuilders_2_1.value;
                            customJoinBuilder(qb, alias);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (customJoinBuilders_2_1 && !customJoinBuilders_2_1.done && (_a = customJoinBuilders_2.return)) _a.call(customJoinBuilders_2);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    if (optionsWithoutRelations.withDeleted) {
                        qb.withDeleted();
                    }
                    count = 0;
                    if (!shouldCount) return [3 /*break*/, 2];
                    return [4 /*yield*/, qb.getManyAndCount()];
                case 1:
                    result = _b.sent();
                    entities = result[0];
                    count = result[1];
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, qb.getMany()];
                case 3:
                    entities = _b.sent();
                    _b.label = 4;
                case 4: return [2 /*return*/, [entities, count]];
            }
        });
    });
}
exports.queryEntityWithoutRelations = queryEntityWithoutRelations;
/**
 * Grouped the relation to the top level entity
 * @param relations
 */
function getGroupedRelations(relations) {
    var e_4, _a;
    var groupedRelations = {};
    try {
        for (var relations_1 = __values(relations), relations_1_1 = relations_1.next(); !relations_1_1.done; relations_1_1 = relations_1.next()) {
            var rel = relations_1_1.value;
            var _b = __read(rel.split("."), 1), topLevel = _b[0];
            if (groupedRelations[topLevel]) {
                groupedRelations[topLevel].push(rel);
            }
            else {
                groupedRelations[topLevel] = [rel];
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (relations_1_1 && !relations_1_1.done && (_a = relations_1.return)) _a.call(relations_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return groupedRelations;
}
exports.getGroupedRelations = getGroupedRelations;
/**
 * Merged the entities and relations that composed by the result of queryEntityWithIds and queryEntityWithoutRelations
 * call
 * @param entitiesAndRelations
 */
function mergeEntitiesWithRelations(entitiesAndRelations) {
    var entitiesAndRelationsById = (0, lodash_1.groupBy)(entitiesAndRelations, "id");
    return (0, lodash_1.map)(entitiesAndRelationsById, function (entityAndRelations) {
        return lodash_1.merge.apply(void 0, __spreadArray([{}], __read(entityAndRelations), false));
    });
}
exports.mergeEntitiesWithRelations = mergeEntitiesWithRelations;
/**
 * Apply the appropriate order depending on the requirements
 * @param repository
 * @param order The field on which to apply the order (e.g { "variants.prices.amount": "DESC" })
 * @param qb
 * @param alias
 * @param shouldJoin In case a join is already applied elsewhere and therefore you want to avoid to re joining the data in that case you can return false for specific relations
 */
function applyOrdering(_a) {
    var repository = _a.repository, order = _a.order, qb = _a.qb, alias = _a.alias, shouldJoin = _a.shouldJoin;
    var toSelect = [];
    var parsed = Object.entries(order).reduce(function (acc, _a) {
        var _b = __read(_a, 2), orderPath = _b[0], orderDirection = _b[1];
        // If the orderPath (e.g variants.prices.amount) includes a point it means that it is to access
        // a child relation of an unknown depth
        if (orderPath.includes(".")) {
            // We are spliting the path and separating the relations from the property to order. (e.g relations ["variants", "prices"] and property "amount"
            var relationsToJoin = orderPath.split(".");
            var propToOrder = relationsToJoin.pop();
            // For each relation we will retrieve the metadata in order to use the right property name from the relation registered in the entity.
            // Each time we will return the child (i.e the relation) and the inverse metadata (corresponding to the child metadata from the parent point of view)
            // In order for the next child to know its parent
            relationsToJoin.reduce(function (_a, child) {
                var _b = __read(_a, 2), parent = _b[0], parentMetadata = _b[1];
                // Find the relation metadata from the parent entity
                var relationMetadata = parentMetadata.relations.find(function (relationMetadata) { return relationMetadata.propertyName === child; });
                // The consumer can refuse to apply a join on a relation if the join has already been applied before calling this util
                var shouldApplyJoin = shouldJoin(child);
                if (shouldApplyJoin) {
                    qb.leftJoin("".concat(parent, ".").concat(relationMetadata.propertyPath), child);
                }
                // Return the child relation to be the parent for the next one, as well as the metadata corresponding the child in order
                // to find the next relation metadata for the next child
                return [child, relationMetadata.inverseEntityMetadata];
            }, [alias, repository.metadata]);
            // The key for variants.prices.amount will be "prices.amount" since we are ordering on the join added to its parent "variants" in this example
            var key_1 = "".concat(relationsToJoin[relationsToJoin.length - 1], ".").concat(propToOrder);
            acc[key_1] = orderDirection;
            toSelect.push(key_1);
            return acc;
        }
        var key = "".concat(alias, ".").concat(orderPath);
        toSelect.push(key);
        acc[key] = orderDirection;
        return acc;
    }, {});
    qb.addSelect(toSelect);
    qb.orderBy(parsed);
}
exports.applyOrdering = applyOrdering;
//# sourceMappingURL=repository.js.map