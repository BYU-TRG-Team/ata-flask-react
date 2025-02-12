export async function getExamCount(): Promise<number> {
    const response = await fetch('/api/exams/count', { method: 'POST' })
    const json = await response.json()
    if (!response.ok) return -1;
    return json['count']
}