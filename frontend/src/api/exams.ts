export async function getExamCount(): any {
    const response = await fetch('/api/exams/count', { method: 'POST' })
    const json = await response.json()
    return json['count']
}