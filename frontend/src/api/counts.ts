export interface ICounts {
    exams: number,
    errors: number,
    'source_texts_count': number
    years: string
}

export async function getCounts(): Promise<ICounts> {
    const response = await fetch('/api/counts', { method: 'POST' })
    return await response.json()
}