export interface ICounts {
    exams: number,
    errors: number,
    'source_texts_count': number
    years: string
}

export async function getCounts(): Promise<ICounts> {
    const response = await fetch('/api/counts', { method: 'POST' })
    if (!response.ok) return {
        exams: -1,
        errors: -1,
        'source_texts_count': -1,
        years: ''
    }
    return await response.json()
}