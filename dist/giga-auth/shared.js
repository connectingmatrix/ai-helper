"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = getErrorMessage;
function getErrorMessage(error, fallback) {
    if (error instanceof Error && error.message)
        return error.message;
    if (typeof error === 'string' && error.trim())
        return error;
    return fallback;
}
