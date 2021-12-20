import axios from 'axios'
import { MAIN_URL } from './Url';
// let token = sessionStorage.getItem("_token")
export function adduser(data) {
    return axios.post(`${MAIN_URL}adduser`, data);
}
export function getuser(data) {
    return axios.post(`${MAIN_URL}getuser`, data);
}
export function getPost() {
    return axios.get(`${MAIN_URL}getpost`);
}
// export function getmenu(token) {
//     return axios.get(`${MAIN_URL}getmenu`, {
//         headers: { "authorization": `Bearer ${token}` }
//     });
// }
// export function confirmorder(data) {
//     return axios.post(`${MAIN_URL}confirmorder`, data);
// }