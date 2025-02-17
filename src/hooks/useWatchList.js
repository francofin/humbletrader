import {useState, useEffect} from 'react'
import useSWR from "swr"
import axios from 'axios'


const fetcher = async (url) => {
    const res = await axios.get(url)
    
    const resData = res.data
    return resData
}


export const useUserWatchList = (stocks) => {
    const [stockString, setStockString] = useState([]);


    let queryList=[]
    if(stocks.length > 0){
        for(let i=0; i<stocks.length; i++){
            queryList.push(stocks[i].symbol)
        }
    }
    
    const queryString = queryList.join(",");


    const {data} = useSWR(
        `${process.env.NEXT_PUBLIC_FMP_URL}${queryString}?apikey=${process.env.NEXT_PUBLIC_FMP_API}`,
        fetcher,
        {
            refreshInterval: 10000
        }
    )

    return data
    
}