// Helper function for authorization
export function isAuthenticated(context: Object) {
    if (!context['user']) {
        throw new Error('Unauthorized');
    }
}