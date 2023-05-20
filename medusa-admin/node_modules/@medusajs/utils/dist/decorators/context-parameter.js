"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedusaContext = void 0;
function MedusaContext() {
    return function (target, propertyKey, parameterIndex) {
        if (!target.MedusaContextIndex_) {
            target.MedusaContextIndex_ = {};
        }
        if (propertyKey in target.MedusaContextIndex_) {
            throw new Error("Only one MedusaContext is allowed on method \"".concat(String(propertyKey), "\"."));
        }
        target.MedusaContextIndex_[propertyKey] = parameterIndex;
    };
}
exports.MedusaContext = MedusaContext;
//# sourceMappingURL=context-parameter.js.map