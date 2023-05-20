"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStep = void 0;
var _1 = require(".");
/**
 * @class TransactionStep
 * @classdesc A class representing a single step in a transaction flow
 */
var TransactionStep = /** @class */ (function () {
    function TransactionStep() {
        /**
         * @member id - The id of the step
         * @member depth - The depth of the step in the flow
         * @member definition - The definition of the step
         * @member invoke - The current state and status of the invoke action of the step
         * @member compensate - The current state and status of the compensate action of the step
         * @member attempts - The number of attempts made to execute the step
         * @member failures - The number of failures encountered while executing the step
         * @member lastAttempt - The timestamp of the last attempt made to execute the step
         * @member next - The ids of the next steps in the flow
         * @member saveResponse - A flag indicating if the response of a step should be shared in the transaction context and available to subsequent steps - default is false
         */
        this.stepFailed = false;
    }
    TransactionStep.prototype.getStates = function () {
        return this.isCompensating() ? this.compensate : this.invoke;
    };
    TransactionStep.prototype.beginCompensation = function () {
        if (this.isCompensating()) {
            return;
        }
        this.stepFailed = true;
        this.attempts = 0;
        this.failures = 0;
        this.lastAttempt = null;
    };
    TransactionStep.prototype.isCompensating = function () {
        return this.stepFailed;
    };
    TransactionStep.prototype.changeState = function (toState) {
        var _a;
        var _b;
        var allowed = (_a = {},
            _a[_1.TransactionState.DORMANT] = [_1.TransactionState.NOT_STARTED],
            _a[_1.TransactionState.NOT_STARTED] = [
                _1.TransactionState.INVOKING,
                _1.TransactionState.COMPENSATING,
                _1.TransactionState.FAILED,
                _1.TransactionState.SKIPPED,
            ],
            _a[_1.TransactionState.INVOKING] = [
                _1.TransactionState.FAILED,
                _1.TransactionState.DONE,
            ],
            _a[_1.TransactionState.COMPENSATING] = [
                _1.TransactionState.REVERTED,
                _1.TransactionState.FAILED,
            ],
            _a[_1.TransactionState.DONE] = [_1.TransactionState.COMPENSATING],
            _a);
        var curState = this.getStates();
        if (curState.state === toState ||
            ((_b = allowed === null || allowed === void 0 ? void 0 : allowed[curState.state]) === null || _b === void 0 ? void 0 : _b.includes(toState))) {
            curState.state = toState;
            return;
        }
        throw new Error("Updating State from \"".concat(curState.state, "\" to \"").concat(toState, "\" is not allowed."));
    };
    TransactionStep.prototype.changeStatus = function (toStatus) {
        var _a;
        var _b;
        var allowed = (_a = {},
            _a[_1.TransactionStepStatus.WAITING] = [
                _1.TransactionStepStatus.OK,
                _1.TransactionStepStatus.TEMPORARY_FAILURE,
                _1.TransactionStepStatus.PERMANENT_FAILURE,
            ],
            _a[_1.TransactionStepStatus.TEMPORARY_FAILURE] = [
                _1.TransactionStepStatus.IDLE,
                _1.TransactionStepStatus.PERMANENT_FAILURE,
            ],
            _a[_1.TransactionStepStatus.PERMANENT_FAILURE] = [_1.TransactionStepStatus.IDLE],
            _a);
        var curState = this.getStates();
        if (curState.status === toStatus ||
            toStatus === _1.TransactionStepStatus.WAITING ||
            ((_b = allowed === null || allowed === void 0 ? void 0 : allowed[curState.status]) === null || _b === void 0 ? void 0 : _b.includes(toStatus))) {
            curState.status = toStatus;
            return;
        }
        throw new Error("Updating Status from \"".concat(curState.status, "\" to \"").concat(toStatus, "\" is not allowed."));
    };
    TransactionStep.prototype.canRetry = function () {
        return !!(this.lastAttempt &&
            this.definition.retryInterval &&
            Date.now() - this.lastAttempt > this.definition.retryInterval * 1e3);
    };
    TransactionStep.prototype.canInvoke = function (flowState) {
        var _a = this.getStates(), status = _a.status, state = _a.state;
        return ((!this.isCompensating() &&
            state === _1.TransactionState.NOT_STARTED &&
            flowState === _1.TransactionState.INVOKING) ||
            status === _1.TransactionStepStatus.TEMPORARY_FAILURE);
    };
    TransactionStep.prototype.canCompensate = function (flowState) {
        return (this.isCompensating() &&
            this.getStates().state === _1.TransactionState.NOT_STARTED &&
            flowState === _1.TransactionState.COMPENSATING);
    };
    return TransactionStep;
}());
exports.TransactionStep = TransactionStep;
//# sourceMappingURL=transaction-step.js.map