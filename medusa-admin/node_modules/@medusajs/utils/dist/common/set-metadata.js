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
exports.setMetadata = void 0;
var errors_1 = require("./errors");
/**
 * Dedicated method to set metadata.
 * @param obj - the entity to apply metadata to.
 * @param metadata - the metadata to set
 * @return resolves to the updated result.
 */
function setMetadata(obj, metadata) {
    var existing = obj.metadata || {};
    var newData = {};
    for (var _i = 0, _a = Object.entries(metadata); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (typeof key !== "string") {
            throw new errors_1.MedusaError(errors_1.MedusaError.Types.INVALID_ARGUMENT, "Key type is invalid. Metadata keys must be strings");
        }
        /**
         * We reserve the empty string as a way to delete a key.
         * If the value is an empty string, we don't
         * set it, and if it exists in the existing metadata, we
         * unset the field.
         */
        if (value === "") {
            if (key in existing) {
                delete existing[key];
            }
            continue;
        }
        newData[key] = value;
    }
    return __assign(__assign({}, existing), newData);
}
exports.setMetadata = setMetadata;
//# sourceMappingURL=set-metadata.js.map