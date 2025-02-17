// import React, {useEffect, useState} from 'react'
// import bannerImages from "@data/banner.json"
// import econImages from "@data/econ.json"
// import energyImages from "@data/energy.json"
// import hcImages from "@data/health-care.json"
// import marketImages from "@data/markets.json"
// import materialImages from "@data/material.json"
// import techImages from "@data/technology.json"
// import commodityImages from "@data/commodities.json"
// import consumerImages from "@data/consumer.json"
// import conflictImages from "@data/conflict.json"
// import industrialsImages from "@data/industrials.json"
// import financeImages from "@data/finance.json"
// import extraImages from "@data/home-images.json";
// import politicImages from "@data/politic.json";
// import usImages from "@data/us.json";
// import russiaImages from "@data/russia.json";
// import midEastImages from "@data/mideast.json";
// import japanImages from "@data/japan.json";
// import cnImages from "@data/china.json";
// import communicationImages from "@data/communications.json";
// import alemanImages from "@data/aleman.json";
// import africaImages from "@data/africa.json";
// import latamImages from "@data/latam.json";
// import commodImages from "@data/commodities.json";
// import cryptoImages from "@data/crypto.json";


// const imagesForConsumers = consumerImages.consumerImages.concat(econImages.econImages[2]);
// const imagesForMaterials = materialImages.marketImages.concat(commodityImages.commodityImages[7], commodityImages.commodityImages[4])
// const imagesForTechnology = techImages.techImages;
// const imagesForFinance = financeImages.financeImages.concat(consumerImages.consumerImages[1], marketImages.marketImages[6], marketImages.marketImages[7]);
// const imagesForEconomy = econImages.econImages.concat(extraImages.extraImages);
// const imagesforMarkets = marketImages.marketImages.concat(extraImages.extraImages);
// const imagesForPolitics = politicImages.polImages;
// const imagesForWar = conflictImages.conflictImages;
// const imagesForHealthCare = hcImages.hcImages;
// const imagesForUS = usImages.usImages;
// const imagesForChina = cnImages.chinaImages;
// const imagesForCommunications = communicationImages.communicationsImages;
// const imagesForMiddleEast = midEastImages.mideastImages;
// const imagesForAfrica = africaImages.africaImages;
// const imagesForLatam = latamImages.latamImages;
// const imagesForRussia = russiaImages.russiaImages;
// const imagesForAleman = alemanImages.alemanImages;
// const imagesForIndus = industrialsImages.industrialsImages;
// const imagesForJapan = japanImages.japonImages;
// const imagesForEnergy = energyImages.energyImages;
// const imagesForComodities = commodImages.commodityImages;
// const imagesForCrypto = cryptoImages.cryptoImages;



// export const useImagesSelector= (newsType) => {

//     //first param is passed into the funtion i.e. URL
//     //econd param is function that calls the param
//     const [images, setImages] = useState([])

//     useEffect(() => {
//         switch(newsType){
//             case "markets":
//                 setImages(imagesforMarkets)
//                 break;
//             case "economy":
//                 setImages(imagesForEconomy)
//                 break;
//             case "politics":
//                 setImages(imagesForPolitics)
//                 break;
//             case "inflation":
//                 setImages(imagesForEconomy)
//                 break;
//             case "war":
//                 setImages(imagesForWar)
//                 break;
//             case "etaunido":
//                 setImages(imagesForUS)
//                 break;
//             case "china":
//                 setImages(imagesForChina)
//                 break;
//             case "russia":
//                 setImages(imagesForRussia)
//                 break;
//             case "mediooeste":
//                 setImages(imagesForMiddleEast)
//                 break;
//             case "aleman":
//                 setImages(imagesForAleman)
//                 break;
//             case "japon":
//                 setImages(imagesForJapan)
//                 break;
//             case "africa":
//                 setImages(imagesForAfrica)
//                 break;
//             case "suram":
//                 setImages(imagesForLatam)
//                 break;
//             case "tech":
//                 setImages(imagesForTechnology)
//                 break;
//             case "energy":
//                 setImages(imagesForEnergy)
//                 break;
//             case "health":
//                 setImages(imagesForHealthCare)
//                 break;
//             case "finance":
//                 setImages(imagesForFinance)
//                 break;
//             case "cons":
//                 setImages(imagesForConsumers)
//                 break;
//             case "materials":
//                 setImages(imagesForMaterials)
//                 break;
//             case "comm":
//                 setImages(imagesForCommunications)
//                 break;
//             case "indus":
//                 setImages(imagesForIndus)
//                 break;
//             case "oil":
//                 setImages(imagesForComodities)
//                 break;
//             case "crypto":
//                 setImages(imagesForCrypto)
//                 break;
//             default:
//                 break
//     }
//     }, [newsType])

//     return images

// }