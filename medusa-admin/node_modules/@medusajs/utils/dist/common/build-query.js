"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nullableValue = exports.addOrderToSelect = exports.buildRelations = exports.buildSelects = exports.objectToStringPath = exports.buildQuery = void 0;
var typeorm_1 = require("typeorm");
var is_object_1 = require("./is-object");
/**
 * Used to build TypeORM queries.
 * @param selector The selector
 * @param config The config
 * @return The QueryBuilderConfig
 */
function buildQuery(selector, config) {
    if (config === void 0) { config = {}; }
    var query = {
        where: buildWhere(selector),
    };
    if ("deleted_at" in selector) {
        query.withDeleted = true;
    }
    if ("skip" in config) {
        ;
        query.skip = config.skip;
    }
    if ("take" in config) {
        ;
        query.take = config.take;
    }
    if (config.relations) {
        query.relations = buildRelations(config.relations);
    }
    if (config.select) {
        query.select = buildSelects(config.select);
    }
    if (config.order) {
        query.order = buildOrder(config.order);
    }
    return query;
}
exports.buildQuery = buildQuery;
/**
 * @param constraints
 *
 * @example
 * const q = buildWhere(
 *   {
 *     id: "1234",
 *     test1: ["123", "12", "1"],
 *     test2: Not("this"),
 *     date: { gt: date },
 *     amount: { gt: 10 },
 *   },
 *)
 *
 * // Output
 * {
 *    id: "1234",
 *    test1: In(["123", "12", "1"]),
 *    test2: Not("this"),
 *    date: MoreThan(date),
 *    amount: MoreThan(10)
 * }
 */
function buildWhere(constraints) {
    var where = {};
    var _loop_1 = function (key, value) {
        if (value === undefined) {
            return "continue";
        }
        if (value === null) {
            where[key] = (0, typeorm_1.IsNull)();
            return "continue";
        }
        if (value instanceof typeorm_1.FindOperator) {
            where[key] = value;
            return "continue";
        }
        if (Array.isArray(value)) {
            where[key] = (0, typeorm_1.In)(value);
            return "continue";
        }
        if (typeof value === "object") {
            Object.entries(value).forEach(function (_a) {
                var objectKey = _a[0], objectValue = _a[1];
                switch (objectKey) {
                    case "lt":
                        where[key] = (0, typeorm_1.LessThan)(objectValue);
                        break;
                    case "gt":
                        where[key] = (0, typeorm_1.MoreThan)(objectValue);
                        break;
                    case "lte":
                        where[key] = (0, typeorm_1.LessThanOrEqual)(objectValue);
                        break;
                    case "gte":
                        where[key] = (0, typeorm_1.MoreThanOrEqual)(objectValue);
                        break;
                    default:
                        if (objectValue != undefined && typeof objectValue === "object") {
                            where[key] = buildWhere(objectValue);
                            return;
                        }
                        where[key] = value;
                }
                return;
            });
            return "continue";
        }
        where[key] = value;
    };
    for (var _i = 0, _a = Object.entries(constraints); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        _loop_1(key, value);
    }
    return where;
}
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
function objectToStringPath(input) {
    if (input === void 0) { input = {}; }
    if (!Object.keys(input).length) {
        return [];
    }
    var output = new Set(Object.keys(input));
    var _loop_2 = function (key) {
        if (input[key] != undefined && typeof input[key] === "object") {
            var deepRes = objectToStringPath(input[key]);
            var items = deepRes.reduce(function (acc, val) {
                acc.push("".concat(key, ".").concat(val));
                return acc;
            }, []);
            items.forEach(function (item) { return output.add(item); });
            return "continue";
        }
        output.add(key);
    };
    for (var _i = 0, _a = Object.keys(input); _i < _a.length; _i++) {
        var key = _a[_i];
        _loop_2(key);
    }
    return Array.from(output);
}
exports.objectToStringPath = objectToStringPath;
function buildSelects(selectCollection) {
    return buildRelationsOrSelect(selectCollection);
}
exports.buildSelects = buildSelects;
function buildRelations(relationCollection) {
    return buildRelationsOrSelect(relationCollection);
}
exports.buildRelations = buildRelations;
function addOrderToSelect(order, select) {
    var _a;
    for (var _i = 0, _b = Object.keys(order); _i < _b.length; _i++) {
        var orderBy = _b[_i];
        if ((0, is_object_1.isObject)(order[orderBy])) {
            select[orderBy] =
                select[orderBy] && (0, is_object_1.isObject)(select[orderBy]) ? select[orderBy] : {};
            addOrderToSelect(order[orderBy], select[orderBy]);
            continue;
        }
        select[orderBy] = (0, is_object_1.isObject)(select[orderBy])
            ? __assign(__assign({}, select[orderBy]), (_a = { id: true }, _a[orderBy] = true, _a)) : true;
    }
}
exports.addOrderToSelect = addOrderToSelect;
/**
 * Convert an collection of dot string into a nested object
 * @example
 * input: [
 *    order,
 *    order.items,
 *    order.swaps,
 *    order.swaps.additional_items,
 *    order.discounts,
 *    order.discounts.rule,
 *    order.claims,
 *    order.claims.additional_items,
 *    additional_items,
 *    additional_items.variant,
 *    return_order,
 *    return_order.items,
 *    return_order.shipping_method,
 *    return_order.shipping_method.tax_lines
 * ]
 * output: {
 *   "order": {
 *     "items": true,
 *     "swaps": {
 *       "additional_items": true
 *     },
 *     "discounts": {
 *       "rule": true
 *     },
 *     "claims": {
 *       "additional_items": true
 *     }
 *   },
 *   "additional_items": {
 *     "variant": true
 *   },
 *   "return_order": {
 *     "items": true,
 *     "shipping_method": {
 *       "tax_lines": true
 *     }
 *   }
 * }
 * @param collection
 */
function buildRelationsOrSelect(collection) {
    var _a;
    var output = {};
    for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
        var relation = collection_1[_i];
        if (relation.indexOf(".") > -1) {
            var nestedRelations = relation.split(".");
            var parent_1 = output;
            while (nestedRelations.length > 1) {
                var nestedRelation = nestedRelations.shift();
                parent_1 = parent_1[nestedRelation] =
                    parent_1[nestedRelation] !== true &&
                        typeof parent_1[nestedRelation] === "object"
                        ? parent_1[nestedRelation]
                        : {};
            }
            parent_1[nestedRelations[0]] = true;
            continue;
        }
        output[relation] = (_a = output[relation]) !== null && _a !== void 0 ? _a : true;
    }
    return output;
}
/**
 * Convert an order of dot string into a nested object
 * @example
 * input: { id: "ASC", "items.title": "ASC", "items.variant.title": "ASC" }
 * output: {
 *   "id": "ASC",
 *   "items": {
 *     "id": "ASC",
 *     "variant": {
 *        "title": "ASC"
 *     }
 *   },
 * }
 * @param orderBy
 */
function buildOrder(orderBy) {
    var _a;
    var output = {};
    var orderKeys = Object.keys(orderBy);
    for (var _i = 0, orderKeys_1 = orderKeys; _i < orderKeys_1.length; _i++) {
        var order = orderKeys_1[_i];
        if (order.indexOf(".") > -1) {
            var nestedOrder = order.split(".");
            var parent_2 = output;
            while (nestedOrder.length > 1) {
                var nestedRelation = nestedOrder.shift();
                parent_2 = parent_2[nestedRelation] = (_a = parent_2[nestedRelation]) !== null && _a !== void 0 ? _a : {};
            }
            parent_2[nestedOrder[0]] = orderBy[order];
            continue;
        }
        output[order] = orderBy[order];
    }
    return output;
}
function nullableValue(value) {
    if (value === null) {
        return (0, typeorm_1.IsNull)();
    }
    else {
        return value;
    }
}
exports.nullableValue = nullableValue;
//# sourceMappingURL=build-query.js.map