import useSWR from "swr"
import axios from 'axios'

const URL = `${process.env.NEXT_PUBLIC_FMP_URL}${process.env.NEXT_PUBLIC_ALL_INDEX}?apikey=${process.env.NEXT_PUBLIC_FMP_API}`;

const fetcher = async (url) => {
    const res = await axios.get(url)
    
    const resData = res.data
    return resData
}

export const useIndex = () => {

    //first param is passed into the funtion i.e. URL
    //econd param is function that calls the param
    const swrRes = useSWR(
        URL,
        fetcher,
        {
            refreshInterval: 2000000
        }
    )

    return swrRes
}