import axios from 'axios';

//Action constants
const START = 'start';
const STOP = 'stop';
const apiUrl = process.env.GET_LEADS_URL || '';


const getLeads = async(postcode: string, q: string, page = 1) => {
    try{
    const headers ={
        headers:{
        authorization: process.env.EWAY_API_KEY
        }

    }
    const reqBody = {postcode, q, page};
    const res = await axios.post(apiUrl, reqBody, headers);
    return res.data;
}catch(error: any){
    console.error("Error in getLeads: ", error.message)
    return {success: false, data:null, totalResults: null, page: null, perPage: null};
}
}

const stopGetLeads = async(taskName: string) => {
    const headers ={
        headers:{
        authorization: process.env.EWAY_API_KEY
        }

    }
    const reqBody = {action: STOP, taskName};
    const res = await axios.post(apiUrl, reqBody, headers);
    return res.data;
}

export {
    getLeads,
    stopGetLeads,
};