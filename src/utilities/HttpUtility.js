import Base64 from 'crypto-js/enc-base64';
import { baseUrl } from '../config';
import { MD5, HmacMD5 } from 'crypto-js';


export const get = (url) => fetch(baseUrl + url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'shk-thalam': generateHmacHeader(url, '', 'GET'),
        'shk-kaun': getDuid()
    },
}).then(res => res.json());


export const post = (url, payload) => fetch(baseUrl + url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'shk-thalam': generateHmacHeader(url, payload, 'POST'),
        'shk-kaun': getDuid()
    },
    body: JSON.stringify(payload)
}).then(res => res.json());




const getDuid = () => {
    return localStorage.getItem("shk-duid") || generateDuid();
}

const generateDuid = () => {
    let privateKey = "pkmkb";
    let date = new Date();
    let duid = MD5(date, privateKey);
    localStorage.setItem("shk-duid", duid);
    return duid;
}

const generateHmacHeader = (url, payload, method) => {
    let privateKey = "cheenmadarchod";
    let message = url + JSON.stringify(payload) + method + getDuid();
    let digest = Base64.stringify(HmacMD5(message, privateKey));
    return digest;
}