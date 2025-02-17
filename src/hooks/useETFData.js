import useSWR from "swr"
import axios from 'axios'


const fetcher = async (url) => {
    const res = await axios.get(url)
    const resData = res.data
    return resData
}

// const URL = `${process.env.NEXT_PUBLIC_FMP_STOCK_PROFILE}${}?apikey=${process.env.NEXT_PUBLIC_FMP_API}`;

export const useETFData = (stock) => {

    //first param is passed into the funtion i.e. URL
    //econd param is function that calls the param
    const {data} = useSWR(
        `${process.env.NEXT_PUBLIC_FMP_ETF_INFO}${stock}&apikey=${process.env.NEXT_PUBLIC_FMP_API}`,
        fetcher,
    )

    return data
    
}