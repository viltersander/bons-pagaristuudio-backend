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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModuleMigrations = exports.loadInternalModule = void 0;
const types_1 = require("@medusajs/types");
const utils_1 = require("@medusajs/utils");
const awilix_1 = require("awilix");
const medusa_telemetry_1 = require("medusa-telemetry");
async function loadInternalModule(container, resolution, logger) {
    const registrationName = resolution.definition.registrationName;
    const { scope, resources } = resolution.moduleDeclaration;
    let loadedModule;
    try {
        loadedModule = (await Promise.resolve().then(() => __importStar(require(resolution.resolutionPath)))).default;
    }
    catch (error) {
        if (resolution.definition.isRequired &&
            resolution.definition.defaultPackage) {
            return {
                error: new Error(`Make sure you have installed the default package: ${resolution.definition.defaultPackage}`),
            };
        }
        return { error };
    }
    if (!loadedModule?.service) {
        container.register({
            [registrationName]: (0, awilix_1.asValue)(undefined),
        });
        return {
            error: new Error("No service found in module. Make sure your module exports a service."),
        };
    }
    if (scope === types_1.MODULE_SCOPE.INTERNAL &&
        resources === types_1.MODULE_RESOURCE_TYPE.SHARED) {
        const moduleModels = loadedModule?.models || null;
        if (moduleModels) {
            moduleModels.map((val) => {
                container.registerAdd("db_entities", (0, awilix_1.asValue)(val));
            });
        }
    }
    const localContainer = resources === types_1.MODULE_RESOURCE_TYPE.ISOLATED
        ? (0, utils_1.createMedusaContainer)()
        : container.createScope();
    if (resources === types_1.MODULE_RESOURCE_TYPE.ISOLATED) {
        const moduleDependencies = resolution?.dependencies ?? [];
        for (const dependency of moduleDependencies) {
            localContainer.register(dependency, (0, awilix_1.asFunction)(() => {
                return container.hasRegistration(dependency)
                    ? container.resolve(dependency)
                    : undefined;
            }));
        }
    }
    const moduleLoaders = loadedModule?.loaders ?? [];
    try {
        for (const loader of moduleLoaders) {
            await loader({
                container: localContainer,
                logger,
                options: resolution.options,
            }, resolution.moduleDeclaration);
        }
    }
    catch (err) {
        container.register({
            [registrationName]: (0, awilix_1.asValue)(undefined),
        });
        return {
            error: new Error(`Loaders for module ${resolution.definition.label} failed: ${err.message}`),
        };
    }
    const moduleService = loadedModule.service;
    container.register({
        [registrationName]: (0, awilix_1.asFunction)((cradle) => {
            return new moduleService(localContainer.cradle, resolution.options, resolution.moduleDeclaration);
        }).singleton(),
    });
    (0, medusa_telemetry_1.trackInstallation)({
        module: resolution.definition.key,
        resolution: resolution.resolutionPath,
    }, "module");
}
exports.loadInternalModule = loadInternalModule;
async function loadModuleMigrations(resolution) {
    let loadedModule;
    try {
        loadedModule = (await Promise.resolve().then(() => __importStar(require(resolution.resolutionPath)))).default;
        return [loadedModule.runMigrations, loadedModule.revertMigration];
    }
    catch {
        return [undefined, undefined];
    }
}
exports.loadModuleMigrations = loadModuleMigrations;
//# sourceMappingURL=load-internal.js.map