import {BfmBaseRequest} from "./bfm-base-request";

export class TopBySubCategoryRequest extends BfmBaseRequest {
    noOfSubCats: number;
    codes: string;
}
