import Container from "@mui/material/Container";
import InfoCard from "./InfoCard";
import { useData, useDrawer } from "../store";
import { Autocomplete, Box, Button, Drawer, IconButton, Slider, TextField, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid'
import { ChevronLeft } from '@mui/icons-material'
import { useEffect, useRef, useState } from "react";
import Plot from 'react-plotly.js'

interface IOptions {
    pointsLost?: number|number[],
    totalScore?: number|number[],
    passageLetters?: string[],
    sourceLangs?: string[],
    targetLangs?: string[],
    errorTypes?: string[],
    severityLevels?: string[],
    ataCodes?: string[]
}

export default function Errors() {
    const { open, setOpen } = useDrawer()
    const { counts, data, filters, fetchData } = useData()
    const [ dataRows, setDataRows ] = useState([])
    const [ graphData, setGraphData ] = useState([])
    
    const defaultOptions: IOptions = {
        pointsLost: [0, 10000],
        totalScore: [0, 10000],
        passageLetters: [],
        sourceLangs: [],
        targetLangs: [],
        errorTypes: [],
        severityLevels: [],
        ataCodes: []
    }

    const [ options, setOptions ] = useState<IOptions>(defaultOptions)

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    }
   
    const convertToRows = () => {
        const groupedOnRow = Object.keys(data).reduce((prev: { [key: number]: {[key: string]: string|number|HTMLDivElement} }, curr: string) => {
                const values = data[curr]
                Object.keys(values).forEach(key => {
                    const value = values[key]
                    if (prev[key]) prev[key][curr] = value
                    else { 
                        prev[key] = {} 
                        prev[key][curr] = value
                    }
                })
                return prev
            }, {})
        const rows = Object.keys(groupedOnRow).map((key) => {
            return {
                id: key,
                ...groupedOnRow[key]
            }
        })
        return rows
    }

    const convertToGraph = () => {
        const nameCountBySrcLang = Object.keys(data?.['name'] ?? {}).reduce((prev, key, i) => {
            const name = data['name'][key]
            const lang = data['src_lang'][i]
            if (prev[lang]['y']) prev[lang]['y']++
            else {
                prev[lang]['x'] = name
                prev[lang]['y'] = 1
            }
            return prev
        }, {})

        console.log(nameCountBySrcLang)
        const _graphData = Object.keys(nameCountBySrcLang).map(key => ({
            ...data[key],
            type: 'histogram'
        }))
        console.log(_graphData)
        setGraphData(_graphData)
    }

    useEffect(() => {
        if (data) {
            setDataRows(convertToRows())
            setGraphData(convertToGraph())
        }
    }, [data])
    
    const DrawerList = (
        <Box sx={{ width: '30vh', p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
                onClick={() => {
                    fetchData({
                        ata_points_range: typeof options.pointsLost === 'number' ? {
                            min: options.pointsLost,
                            max: options.pointsLost
                        } : {
                            min: options.pointsLost![0],
                            max: options.pointsLost![1]
                        },
                        ata_score_range: typeof options.totalScore === 'number' ? {
                            min: options.totalScore,
                            max: options.totalScore
                        } : {
                            min: options.totalScore![0],
                            max: options.totalScore![1]
                        },
                        passage_letters: options.passageLetters ?? [],
                        src_langs: options.sourceLangs ?? [],
                        tgt_langs: options.targetLangs ?? [],
                        error_types: options.errorTypes ?? [],
                        severities: options.severityLevels ?? [],
                        ata_codes: options.ataCodes ?? []
                    })
                    setOpen(false)
                }}
                sx={{ border: '1px solid black' }}>Submit Query</Button>
            <Typography noWrap={false}>Points Lost on Error</Typography>
            <Slider 
                id='pointsLostSlider'
                value={options.pointsLost}
                onChange={(_, newValue: number|number[]) => setOptions({...options, pointsLost: newValue})}
                marks
                min={filters?.ata_points_range.min ?? 0}
                max={filters?.ata_points_range.max ?? 0}
                defaultValue={[0, 10000]}
                step={1}
                valueLabelDisplay="on"
                sx={{
                    pt: 8,
                    width: '90%',
                    alignSelf: 'center'
                }}
                />
            <Typography noWrap={false}>ATA Total Score</Typography>
            <Slider 
                value={options.totalScore}
                onChange={(_, newValue: number|number[]) => setOptions({...options, totalScore: newValue})}
                min={filters?.ata_score_range.min ?? 0}
                max={filters?.ata_score_range.max ?? 0}
                defaultValue={[0, 10000]}
                step={1}
                valueLabelDisplay="on"
                sx={{
                    pt: 8,
                    width: '90%',
                    alignSelf: 'center'
                }}
                />
            <Typography noWrap={false}>Select one or more of the following source passage letters:</Typography>
            <Autocomplete
                size="small"
                multiple
                value={options.passageLetters}
                onChange={(_, newValue) => setOptions({...options, passageLetters: newValue})}
                options={filters?.passage_letters ?? []}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="passage letters"
                    />
                )}
                sx={{
                }}
            />
            <Typography noWrap={false}>Select one or more of the following source languages:</Typography>
            <Autocomplete
                size="small"
                multiple
                value={options.sourceLangs}
                onChange={(_, newValue) => setOptions({...options, sourceLangs: newValue})}
                options={filters?.src_langs ?? []}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="source languages"
                    />
                )}
            />
            <Typography noWrap={false}>Select one or more of the following target languages:</Typography>
            <Autocomplete
                size="small"
                multiple
                value={options.targetLangs}
                onChange={(_, newValue) => setOptions({...options, targetLangs: newValue})}
                options={filters?.tgt_langs ?? []}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="target languages"
                    />
                )}
            />
            <Typography noWrap={false}>Select one or more of the following error types:</Typography>
            <Autocomplete
                size="small"
                multiple
                id="tags-outlined"
                value={options.errorTypes}
                onChange={(_, newValue) => setOptions({...options, errorTypes: newValue})}
                options={filters?.error_types ?? []}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="error types"
                    />
                )}
            />
            <Typography noWrap={false}>Select one or more of the following error severity levels:</Typography>
            <Autocomplete
                size="small"
                multiple
                value={options.severityLevels}
                onChange={(_, newValue) => setOptions({...options, severityLevels: newValue})}
                options={filters?.severities ?? []}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="severity levels"
                    />
                )}
            />
            <Typography noWrap={false}>Select one or more of the following error ATA codes:</Typography>
            <Autocomplete
                size="small"
                multiple
                value={options.ataCodes}
                onChange={(_, newValue) => setOptions({...options, ataCodes: newValue})}
                options={filters?.ata_codes ?? []}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="ata codes"
                    />
                )}
            />
            <Button onClick={() => setOptions(defaultOptions)}>Reset Query</Button>
        </Box>
    )

    return (
        <>
            <Container sx={{ pt: 4,  display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <InfoCard title="Total Number of Errors" body={counts?.errors.toString() ?? '...'} />
                <InfoCard title="Total Number of Filtered Errors" body={dataRows.length.toString()} />
                { data && 
                <DataGrid
                    sx={{
                        height: '600px',
                        flex: '1 0 100%',
                        '&.MuiDataGrid-cell': {
                            textWrap: "wrap",
                            overflow: 'auto'
                        }
                    }}
                    columns={[
                        { field: 'exam_id' },
                        { field: 'marked_tgt_seg', width: 200, renderCell: (params) => <div className="MuiDataGrid-cell" dangerouslySetInnerHTML={{ __html: params.value}}></div> },
                        { field: 'simplified_src_text', width: 200 },
                        { field: 'name' },
                        { field: 'severity' },
                        { field: 'ata_points' },
                        { field: 'ata_score' }
                    ]}
                    rows={dataRows}
                >

                </DataGrid>

                }

                <Plot
                    data={graphData}
                    layout={{
                        title:'Error Types by Source Language',
                        xaxis: { title: 'Source of Language'},
                        yaxis: { title: 'Count of Errors' },
                        barmode: 'group'
                    }} />
            </Container>

            <Drawer 
                open={open} 
                onClose={() => toggleDrawer(false)}
                variant="temporary"
                >
                <IconButton sx={{ mt: 2, mr: 2, alignSelf: 'flex-end' }} onClick={() => setOpen(!open)}>
                    <ChevronLeft />
                </IconButton>
                {DrawerList}
            </Drawer>               
        </>
    )
}