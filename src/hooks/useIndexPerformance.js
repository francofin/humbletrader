import useSWR from "swr"
import axios from 'axios'



const fetcher = async (url) => {
    const res = await axios.get(url)
    
    const resData = res.data
    return resData
}

export const useIndexPerformance = (index) => {

    //first param is passed into the funtion i.e. URL
    //econd param is function that calls the param
    const {data} = useSWR(
        `${process.env.NEXT_PUBLIC_FMP_INDEX_PERF}%5E${index}?apikey=${process.env.NEXT_PUBLIC_FMP_API}`,
        fetcher,
        {
            refreshInterval: 2000000
        }
    )

    return data
}