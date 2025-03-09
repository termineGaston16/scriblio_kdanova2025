export const defineTitleToolbar = (path: string | null): string => {
    if (typeof path !== 'string') return 'Todas las Notas';

    if (path === '/favoritos') return 'Favortos'
    if (path === '/pendientes') return 'Pendientes'
    if (path === '/completadas') return 'Completadas'
    if (path === '/fijas') return 'Fijas'
    if (path === '/archivadas') return 'Archivadas'

    return 'Todas las Notas';
}