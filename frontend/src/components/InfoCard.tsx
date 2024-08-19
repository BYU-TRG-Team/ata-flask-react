import { Card, CardContent, Typography } from "@mui/material"

export interface InfoCardProps {
    title: string,
    body: string
}

export default function InfoCard({title, body}: InfoCardProps) {
    return (
        <Card raised sx={{ 
            height: 156,
            flex: {
                xs: '1 1 100%',
                sm: '1 1 40%',
                md: '1 1 40%',
                xl: '1 1 20%'
            }
            }}>
            <CardContent sx={{ height: 1/1, px: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant='h6' sx={{ fontWeight: 300 }}>{title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 400 }}>{body}</Typography>
            </CardContent>
        </Card>
    )
}
