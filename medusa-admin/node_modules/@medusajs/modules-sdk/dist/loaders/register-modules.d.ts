import { ExternalModuleDeclaration, InternalModuleDeclaration, ModuleResolution } from "@medusajs/types";
export declare const registerModules: (modules?: Record<string, false | string | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>>) => Record<string, ModuleResolution>;
export declare const registerMedusaModule: (moduleKey: string, moduleDeclaration: InternalModuleDeclaration | ExternalModuleDeclaration) => Record<string, ModuleResolution>;
