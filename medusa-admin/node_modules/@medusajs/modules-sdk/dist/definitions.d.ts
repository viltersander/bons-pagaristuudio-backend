import { ModuleDefinition } from "@medusajs/types";
export declare enum Modules {
    EVENT_BUS = "eventBus",
    STOCK_LOCATION = "stockLocationService",
    INVENTORY = "inventoryService",
    CACHE = "cacheService"
}
export declare const ModulesDefinition: {
    [key: string]: ModuleDefinition;
};
export declare const MODULE_DEFINITIONS: ModuleDefinition[];
export default MODULE_DEFINITIONS;
