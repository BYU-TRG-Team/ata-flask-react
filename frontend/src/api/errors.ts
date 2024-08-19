import type { IFilters } from "./filters"

export async function getErrorCount(): any {
    const response = await fetch('/api/errors/count', { method: 'POST' })
    const json = await response.json()
    return json['count']
}

export async function getErrors(filter?: IFilters): any {
    const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filter ?? null)
    })
    const json = await response.json()
    console.log(json)
    return json
}