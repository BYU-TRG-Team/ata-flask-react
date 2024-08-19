export async function getSourceTextsCount(): any {
    const response = await fetch('/api/source_texts/count', { method: 'POST' })
    const json = await response.json()
    return json['count']
}