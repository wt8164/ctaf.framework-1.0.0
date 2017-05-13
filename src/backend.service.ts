import { Injectable } from '@angular/core';
import { Headers, Http, Response, ResponseContentType, RequestMethod, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Context } from './context';

export enum BodyType {
    FormData = 1,
    FormUrlEncoded = 2,
    Json = 3
}

@Injectable()
export class BackendServiceOptions {
    params?: any;
    responseType?: ResponseContentType;
    headers?: Headers;
    requestBodyType?: BodyType;
    json?: any;
    withCredentials?: boolean;

    constructor() {
        this.headers = new Headers();
        this.requestBodyType = BodyType.Json;
        this.responseType = ResponseContentType.Json;
        this.withCredentials = false;
    }
}

@Injectable()
export class BackendService {
    constructor(private http: Http) { }

    /**
     * @description Get method to http request.
     * @param {string} url http request url.
     * @param {any} params http request parameters.
     * @param {BackendServiceOptions} options http request options.
     * @return {any} http response.
     */
    public get(url: string, params?: any, options?: BackendServiceOptions): Promise<any> {

        if (params != null) {
            url += this.getQueryString(params);
        }
        url = `${Context.instance.httpServiceDomain}${url}`;


        let requestOptions = this.getRequestOptions(RequestMethod.Get, options);

        return this.http.get(url, requestOptions)
            .toPromise()
            .then(response => this.parse(response, options))
            .catch(this.handleError);
    }

    /**
     * @description Head method to http request.
     * @param {string} url http request url.
     * @param {any} params http request parameters.
     * @param {BackendServiceOptions} options http request options.
     * @return {any} http response.
     */
    public head(url: string, params?: any, options?: BackendServiceOptions): Promise<any> {

        if (params != null) {
            url += this.getQueryString(params);
        }
        url = `${Context.instance.httpServiceDomain}${url}`;

        let requestOptions = this.getRequestOptions(RequestMethod.Head, options);

        return this.http.head(url, requestOptions)
            .toPromise()
            .then(response => this.parse(response, options))
            .catch(this.handleError);
    }

    /**
     * @description Post method to http request.
     * @param {string} url http request url.
     * @param {any} json http request json body.
     * @param {BackendServiceOptions} options http request options.
     * @return {any} http response.
     */
    public post(url: string, json?: any, options?: BackendServiceOptions): Promise<any> {

        url = `${Context.instance.httpServiceDomain}${url}`;
        options = options ? options : new BackendServiceOptions();
        options.json = (options.requestBodyType === BodyType.Json && options.json) ? options.json : json;

        let requestOptions = this.getRequestOptions(RequestMethod.Post, options);

        return this.http
            .post(url, requestOptions.body, requestOptions)
            .toPromise()
            .then(response => this.parse(response, options))
            .catch(this.handleError);
    }

    /**
     * @description Put method to http request.
     * @param {string} url http request url.
     * @param {any} json http request json body.
     * @param {BackendServiceOptions} options http request options.
     * @return {any} http response.
     */
    public put(url: string, json?: any, options?: BackendServiceOptions): Promise<any> {

        url = `${Context.instance.httpServiceDomain}${url}`;
        options = options ? options : new BackendServiceOptions();
        options.json = (options.requestBodyType === BodyType.Json && options.json) ? options.json : json;

        let requestOptions = this.getRequestOptions(RequestMethod.Put, options);

        return this.http
            .put(url, requestOptions.body, requestOptions)
            .toPromise()
            .then(response => this.parse(response, options))
            .catch(this.handleError);
    }

    /**
     * @description Patch method to http request.
     * @param {string} url http request url.
     * @param {any} json http request json body.
     * @param {BackendServiceOptions} options http request options.
     * @return {any} http response.
     */
    public patch(url: string, json?: any, options?: BackendServiceOptions): Promise<any> {

        url = `${Context.instance.httpServiceDomain}${url}`;
        options = options ? options : new BackendServiceOptions();
        options.json = (options.requestBodyType === BodyType.Json && options.json) ? options.json : json;

        let requestOptions = this.getRequestOptions(RequestMethod.Patch, options);

        return this.http
            .patch(url, requestOptions.body, requestOptions)
            .toPromise()
            .then(response => this.parse(response, options))
            .catch(this.handleError);
    }

    /**
     * @description Delete method to http request.
     * @param {string} url http request url.
     * @param {any} params http request parameters.
     * @param {BackendServiceOptions} options http request options.
     * @return {any} http response.
     */
    public delete(url: string, params?: any, options?: BackendServiceOptions): Promise<any> {

        if (params != null) {
            url += this.getQueryString(params);
        }

        url = `${Context.instance.httpServiceDomain}${url}`;
        let requestOptions = this.getRequestOptions(RequestMethod.Delete, options);

        return this.http
            .delete(url, requestOptions)
            .toPromise()
            .then(response => this.parse(response, options))
            .catch(this.handleError);
    }

    /**
     * @description Convert BackendServiceOptions to Http RequestOptions.
     * @param {RequestMethod} method http method.
     * @param {BackendServiceOptions} options http request options.
     * @return {RequestOptions} http RequestOptions.
     */
    private getRequestOptions(method: RequestMethod, options?: BackendServiceOptions): RequestOptions {
        let body: any;
        let headers = (options && options.headers) ? options.headers : new Headers();
        let userTokenObj = sessionStorage.getItem('USER_INFO');
        let userToken = null;
        if (userTokenObj) {
            try {
                userToken = JSON.parse(userTokenObj).Token;
            } catch (e) {
                console.log('Get user token from sessionStorage failed: ');
                console.log(e);
            }
        }
        if (userToken) {
            headers.append('Authorization', userToken);
        }
        headers.append('Accept-Language', sessionStorage.getItem('Language'));

        if (options && method !== RequestMethod.Get && method !== RequestMethod.Head) {
            options.requestBodyType = (options.requestBodyType) ? options.requestBodyType : BodyType.Json;
            switch (options.requestBodyType) {
                case BodyType.FormData:
                    body = this.getFormData(options.params);
                    break;
                case BodyType.FormUrlEncoded:
                    body = this.getEncodeParams(options.params);
                    headers.append('Content-Type', 'application/x-www-form-urlencoded');
                    break;
                case BodyType.Json:
                    body = options.json;
                    headers.append('Content-Type', 'application/json');
                    break;
            }
        }

        return new RequestOptions({
            headers: headers,
            body: body,
            withCredentials: options ? options.withCredentials : false,
        });
    }

    /**
     * @description Parse response body respective to the response type in BackendServiceOptions.
     * @param {Response} response http method.
     * @param {BackendServiceOptions} options http request options.
     * @return {any} http response in specific format.
     */
    private parse(response: Response, options?: BackendServiceOptions): any {
        let data;
        if (options && options.responseType != null) {
            switch (options.responseType) {
                case ResponseContentType.Json:
                    data = response.json();
                    break;
                case ResponseContentType.Text:
                    data = response.text();
                    break;
                case ResponseContentType.Blob:
                    data = response.blob();
                    break;
                case ResponseContentType.ArrayBuffer:
                    data = response.arrayBuffer();
                    break;
                default:
                    data = response.json();
                    break;
            }
        } else {
            data = response.json();
        }

        return data;
    }

    /**
     * @description Generate query string.
     * @param {any} params parameters to http request.
     * @return {string} query string.
     */
    private getQueryString(params: any): string {
        return '?' + this.getEncodeParams(params);
    }

    /**
     * @description Generate urlencoded string.
     * @param {any} params parameters to http request.
     * @return {string} urlencoded string.
     */
    private getEncodeParams(params: any): string {
        return Object.keys(params).reduce(function (previous, key) {
            previous.push(key + '=' + encodeURIComponent(params[key]));
            return previous;
        }, []).join('&');
    }

    /**
     * @description Generate multipart formData.
     * @param {any} params parameters to http request.
     * @return {string} multipart formData.
     */
    private getFormData(params: any): FormData {
        let formData = new FormData();

        if (params) {
            Object.keys(params).forEach(function (key) {
                formData.append(key, params[key]);
            });
        }

        return formData;
    }

    /**
     * @description Error handler.
     * @param {any} error http error exception data.
     * @return {any} http error response.
     */
    private handleError(error: any): Promise<any> {
        return Promise.reject(error);
    }
}
