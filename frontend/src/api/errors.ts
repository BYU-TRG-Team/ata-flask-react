import type { IFilters } from "./filters"

export async function getErrorCount(): Promise<number> {
    const response = await fetch('/api/errors/count', { method: 'POST' })
    const json = await response.json()
    if (!response.ok) return -1;
    return json['count']
}

export async function getErrors(filter?: IFilters): Promise<any> {
    const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filter ?? null)
    })
    if (!response.ok) return {};
    const json = await response.json()
    return json
}