import useSWR from "swr"
import axios from 'axios'




const fetcher = async (url) => {
    const res = await axios.get(url)
    const resData = res
    return resData
}

export const useTopPerformers = (index) => {

    // let URL = `${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettopperformers/${index}`;

    //first param is passed into the funtion i.e. URL
    //econd param is function that calls the param
    let myDate = new Date();
    const {data} = useSWR(
        `${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettopperformers/${index}`,
        fetcher,
        (myDate.getDay() !== 6 || myDate.getDay() !== 5) &&
        {
            refreshInterval: 30000000
        }
    )

    return data
}