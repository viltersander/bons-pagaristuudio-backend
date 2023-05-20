"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionState = exports.TransactionStepStatus = exports.TransactionHandlerType = void 0;
var TransactionHandlerType;
(function (TransactionHandlerType) {
    TransactionHandlerType["INVOKE"] = "invoke";
    TransactionHandlerType["COMPENSATE"] = "compensate";
})(TransactionHandlerType = exports.TransactionHandlerType || (exports.TransactionHandlerType = {}));
var TransactionStepStatus;
(function (TransactionStepStatus) {
    TransactionStepStatus["IDLE"] = "idle";
    TransactionStepStatus["OK"] = "ok";
    TransactionStepStatus["WAITING"] = "waiting_response";
    TransactionStepStatus["TEMPORARY_FAILURE"] = "temp_failure";
    TransactionStepStatus["PERMANENT_FAILURE"] = "permanent_failure";
})(TransactionStepStatus = exports.TransactionStepStatus || (exports.TransactionStepStatus = {}));
var TransactionState;
(function (TransactionState) {
    TransactionState["NOT_STARTED"] = "not_started";
    TransactionState["INVOKING"] = "invoking";
    TransactionState["WAITING_TO_COMPENSATE"] = "waiting_to_compensate";
    TransactionState["COMPENSATING"] = "compensating";
    TransactionState["DONE"] = "done";
    TransactionState["REVERTED"] = "reverted";
    TransactionState["FAILED"] = "failed";
    TransactionState["DORMANT"] = "dormant";
    TransactionState["SKIPPED"] = "skipped";
})(TransactionState = exports.TransactionState || (exports.TransactionState = {}));
__exportStar(require("./transaction-orchestrator"), exports);
__exportStar(require("./transaction-step"), exports);
__exportStar(require("./distributed-transaction"), exports);
//# sourceMappingURL=index.js.map