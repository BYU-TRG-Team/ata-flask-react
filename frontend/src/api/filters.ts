export interface IRange {
    min: number,
    max: number
}

export interface IFilters {
    ata_points_range: IRange,
    ata_score_range: IRange,
    passage_letters: string[],
    src_langs: string[],
    tgt_langs: string[],
    error_types: string[],
    severities: string[],
    ata_codes: string[]
}

export async function getFilters(): Promise<IFilters> {
    const response = await fetch('/api/filters', { method: 'POST' })
    if (!response.ok) return {
        ata_points_range: { min: 0, max: 0 },
        ata_score_range: { min: 0, max: 0 },
        passage_letters: [],
        src_langs: [],
        tgt_langs: [],
        error_types: [],
        severities: [],
        ata_codes: []
    }

    const json = (await response.json()) as IFilters
    return {
        ata_points_range: {
            min: parseInt(json?.ata_points_range?.min?.toString() ?? 0),
            max: parseInt(json?.ata_points_range?.max?.toString() ?? 0)
        },
        ata_score_range: {
            min: parseInt(json?.ata_score_range?.min?.toString() ?? 0),
            max: parseInt(json?.ata_score_range?.max?.toString() ?? 0),
        },
        passage_letters: json?.passage_letters?.sort() ?? [],
        src_langs: json?.src_langs?.sort() ?? [],
        tgt_langs: json?.tgt_langs?.sort() ?? [],
        error_types: json?.error_types?.sort() ?? [],
        severities: json?.severities?.sort() ?? [],
        ata_codes: json?.ata_codes?.sort() ?? []
    }
}