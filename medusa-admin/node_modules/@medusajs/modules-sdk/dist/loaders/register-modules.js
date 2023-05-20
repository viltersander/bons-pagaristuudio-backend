"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMedusaModule = exports.registerModules = void 0;
const types_1 = require("@medusajs/types");
const resolve_cwd_1 = __importDefault(require("resolve-cwd"));
const definitions_1 = __importDefault(require("../definitions"));
const registerModules = (modules) => {
    const moduleResolutions = {};
    const projectModules = modules ?? {};
    for (const definition of definitions_1.default) {
        const customConfig = projectModules[definition.key];
        const isObj = typeof customConfig === "object";
        if (isObj && customConfig.scope === types_1.MODULE_SCOPE.EXTERNAL) {
            // TODO: getExternalModuleResolution(...)
            throw new Error("External Modules are not supported yet.");
        }
        moduleResolutions[definition.key] = getInternalModuleResolution(definition, customConfig);
    }
    return moduleResolutions;
};
exports.registerModules = registerModules;
const registerMedusaModule = (moduleKey, moduleDeclaration) => {
    const moduleResolutions = {};
    for (const definition of definitions_1.default) {
        if (definition.key !== moduleKey) {
            continue;
        }
        if (moduleDeclaration.scope === types_1.MODULE_SCOPE.EXTERNAL) {
            // TODO: getExternalModuleResolution(...)a
            throw new Error("External Modules are not supported yet.");
        }
        moduleResolutions[definition.key] = getInternalModuleResolution(definition, moduleDeclaration);
    }
    return moduleResolutions;
};
exports.registerMedusaModule = registerMedusaModule;
function getInternalModuleResolution(definition, moduleConfig) {
    if (typeof moduleConfig === "boolean") {
        if (!moduleConfig && definition.isRequired) {
            throw new Error(`Module: ${definition.label} is required`);
        }
        if (!moduleConfig) {
            return {
                resolutionPath: false,
                definition,
                dependencies: [],
                options: {},
            };
        }
    }
    const isObj = typeof moduleConfig === "object";
    let resolutionPath = definition.defaultPackage;
    // If user added a module and it's overridable, we resolve that instead
    const isString = typeof moduleConfig === "string";
    if (definition.canOverride && (isString || (isObj && moduleConfig.resolve))) {
        resolutionPath = (0, resolve_cwd_1.default)(isString ? moduleConfig : moduleConfig.resolve);
    }
    const moduleDeclaration = isObj ? moduleConfig : {};
    const additionalDependencies = isObj ? moduleConfig.dependencies || [] : [];
    return {
        resolutionPath,
        definition,
        dependencies: [
            ...new Set((definition.dependencies || []).concat(additionalDependencies)),
        ],
        moduleDeclaration: {
            ...definition.defaultModuleDeclaration,
            ...moduleDeclaration,
        },
        options: isObj ? moduleConfig.options ?? {} : {},
    };
}
//# sourceMappingURL=register-modules.js.map