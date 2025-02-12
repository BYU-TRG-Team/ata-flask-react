export async function getSourceTextsCount(): Promise<number> {
    const response = await fetch('/api/source_texts/count', { method: 'POST' })
    if (!response.ok) return -1;

    const json = await response.json()
    return json['count']
}