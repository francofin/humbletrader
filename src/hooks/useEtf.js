import useSWR from "swr"
import axios from 'axios'

const URL = `${process.env.NEXT_PUBLIC_FMP_URL}${process.env.NEXT_PUBLIC_ETF_PERFORMANCE}?apikey=${process.env.NEXT_PUBLIC_FMP_API}`;

const fetcher = async (url) => {
    const res = await axios.get(url)
    
    const resData = res.data
    return resData
}

export const useEtfPerformance = () => {

    //first param is passed into the funtion i.e. URL
    //econd param is function that calls the param
    const swrRes = useSWR(
        URL,
        fetcher,
        {
            refreshInterval: 20000
        }
    )

    return swrRes
}