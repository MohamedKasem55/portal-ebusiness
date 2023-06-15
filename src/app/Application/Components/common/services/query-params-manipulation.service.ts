import {Injectable} from "@angular/core";

@Injectable()
export class QueryParamsManipulationService{


    static parseQueryParams(uri){
        const queryParamsIndex = uri.indexOf('?')
        if(queryParamsIndex && queryParamsIndex != -1){
            return uri.substring(uri.indexOf('?'))
        }
    }

    static parseQueryParamsArr(queryParams){
        if(queryParams){
            return queryParams.substring(1).split('&')
        }
    }

    static getQueryParam(param: string, queryParams: string){
        let params;
        let value;

        if(queryParams){
            if(queryParams[0] == '?'){
                queryParams = queryParams.substring(1)
            }
            params = queryParams.split('&')
        }

        params?.forEach(keyValue => {
            if(keyValue.indexOf(param) != -1){
                value = keyValue.split('=')[1]
            }
        })
        return value
    }

    static transformParamArrToObj(arr){
        const paramsKeyValue = []
        arr.forEach(param => {
            paramsKeyValue.push(param.split('='))
        })

        const paramsMap = new Map(paramsKeyValue)
        let obj = {}

        paramsMap.forEach((value, key: string) => {
            obj[key] = value
        })

        return obj
    }
}