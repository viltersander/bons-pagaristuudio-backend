/// <reference types="node" />
import { EventEmitter } from "events";
import { TransactionStepsDefinition, TransactionState } from ".";
import { DistributedTransaction } from "./distributed-transaction";
import { TransactionStep, TransactionStepHandler } from "./transaction-step";
export declare type TransactionFlow = {
    transactionModelId: string;
    definition: TransactionStepsDefinition;
    transactionId: string;
    hasFailedSteps: boolean;
    hasSkippedSteps: boolean;
    state: TransactionState;
    steps: {
        [key: string]: TransactionStep;
    };
};
/**
 * @class TransactionOrchestrator is responsible for managing and executing distributed transactions.
 * It is based on a single transaction definition, which is used to execute all the transaction steps
 */
export declare class TransactionOrchestrator extends EventEmitter {
    id: string;
    private definition;
    private ROOT_STEP;
    private invokeSteps;
    private compensateSteps;
    DEFAULT_RETRIES: number;
    constructor(id: string, definition: TransactionStepsDefinition);
    private static SEPARATOR;
    static getKeyName(...params: string[]): string;
    private getPreviousStep;
    private getInvokeSteps;
    private getCompensationSteps;
    private canMoveForward;
    private canMoveBackward;
    private canContinue;
    private checkAllSteps;
    private flagStepsToRevert;
    private setStepSuccess;
    private setStepFailure;
    private executeNext;
    /**
     * Start a new transaction or resume a transaction that has been previously started
     * @param transaction - The transaction to resume
     */
    resume(transaction: DistributedTransaction): Promise<void>;
    /**
     * Cancel and revert a transaction compensating all its executed steps. It can be an ongoing transaction or a completed one
     * @param transaction - The transaction to be reverted
     */
    cancelTransaction(transaction: DistributedTransaction): Promise<void>;
    private createTransactionFlow;
    private loadTransactionById;
    private buildSteps;
    /** Create a new transaction
     * @param transactionId - unique identifier of the transaction
     * @param handler - function to handle action of the transaction
     * @param payload - payload to be passed to all the transaction steps
     */
    beginTransaction(transactionId: string, handler: TransactionStepHandler, payload?: unknown): Promise<DistributedTransaction>;
    private getStepByAction;
    private getTransactionAndStepFromIdempotencyKey;
    /** Register a step success for a specific transaction and step
     * @param responseIdempotencyKey - The idempotency key for the step
     * @param handler - The handler function to execute the step
     * @param transaction - The current transaction. If not provided it will be loaded based on the responseIdempotencyKey
     * @param response - The response of the step
     */
    registerStepSuccess(responseIdempotencyKey: string, handler?: TransactionStepHandler, transaction?: DistributedTransaction, response?: unknown): Promise<DistributedTransaction>;
    /**
     * Register a step failure for a specific transaction and step
     * @param responseIdempotencyKey - The idempotency key for the step
     * @param error - The error that caused the failure
     * @param handler - The handler function to execute the step
     * @param transaction - The current transaction
     * @param response - The response of the step
     */
    registerStepFailure(responseIdempotencyKey: string, error: Error | null, handler?: TransactionStepHandler, transaction?: DistributedTransaction, response?: unknown): Promise<DistributedTransaction>;
}
