import { create } from "zustand"
import type { ICounts } from "./api/counts"
import type { IFilters } from './api/filters'
import { getErrors } from "./api/errors"

interface ICountsStore  {
    counts: ICounts|null,
    data: any,
    filters: IFilters|null,
    setCounts: (counts: ICounts) => void,
    setFilters: (filters: IFilters) => void
    fetchData: (filters?: IFilters) => void
}

export const useData = create<ICountsStore>((set) => ({ 
    counts: null,
    data: null,
    filters: null,
    setCounts: (counts) => set({ counts }),
    setFilters: (filters) => set({ filters }),
    fetchData: (filters) => {
        const _fetchData = async () => {
            const data = await getErrors(filters)
            set({ data })
        }

        _fetchData()
    }
}))


export const useDrawer = create<{ open: boolean, setOpen: (open: boolean) => void }>(set => ({
    open: true,
    setOpen: (open) => set({ open }) 
}))