import useSWRImmutable from 'swr/immutable'
import axios from 'axios'
import { idbPromise } from "@utils/helpers";

const fetcher = async (url) => {
    const res = await axios.get(url)
    const resData = res
    return resData
}

const shouldFetch = (index) => {
    let items = idbPromise(index, 'get').then((indexedItems => {
        return indexedItems
    }))
    if(items.length == 0){
        return null;
    } else{
        return items.data
    }
}



export const useIndexMetric = (index, ep) => {

    // let URL = `${process.env.NEXT_PUBLIC_FINTANK_API_URL}/gettopperformers/${index}`;

    //first param is passed into the funtion i.e. URL
    //econd param is function that calls the param

    const {data} = useSWRImmutable(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/${ep}/${index}`,
          fetcher
    )


    return data
}