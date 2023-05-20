import { ExternalModuleDeclaration, InternalModuleDeclaration } from "@medusajs/types";
export declare class MedusaModule {
    static bootstrap(moduleKey: string, defaultPath: string, declaration?: InternalModuleDeclaration | ExternalModuleDeclaration, injectedDependencies?: Record<string, any>): Promise<{
        [key: string]: any;
    }>;
    static migrateUp(moduleKey: string, modulePath: string, options?: Record<string, any>): Promise<void>;
    static migrateDown(moduleKey: string, modulePath: string, options?: Record<string, any>): Promise<void>;
}
