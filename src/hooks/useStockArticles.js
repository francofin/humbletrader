import useSWR from "swr"
import axios from 'axios'


const fetcher = async (url) => {
    const res = await axios.get(url)
    const resData = res.data
    return resData
}


export const useStockArticles = (ticker) => {

    const {data} = useSWR(
        `${process.env.NEXT_PUBLIC_FMP_STOCK_NEWS}${ticker}&limit=50&apikey=${process.env.NEXT_PUBLIC_FMP_API}`,
        fetcher,
        {
            refreshInterval: 3000000000
        }
    )

    return data
    
}