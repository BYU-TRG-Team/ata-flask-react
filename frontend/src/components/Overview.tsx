import InfoCard from "./InfoCard";
import { Container } from "@mui/material";
import { useData } from "../store";

export default function Overview() {
    const { counts } = useData()

    return (
        <>
            <Container sx={{ pt: 4,  display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <InfoCard title="Total Number of Exams" body={counts?.exams.toString() ?? '...'} />
                <InfoCard title="Total Number of Errors" body={counts?.errors.toString() ?? '...'} />
                <InfoCard title="Total Number of Source Texts" body={counts?.source_texts_count.toString() ?? '...'} />
                <InfoCard title="Exam Years Covered" body={counts?.years ?? '...'} />
            </Container>
        </>
    )
}