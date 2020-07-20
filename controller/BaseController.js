var api_v = process.API_VRSN || "1.0";
var lng_v = process.LNG_VRSN || "1.0";


const generateResponse = (err_code, err_msg, addtionaldata) => {
    addtionaldata = addtionaldata || {}
    let data = {
        srvr_res_seq: Math.random().toString(36).replace('0.', ''),
        srvr_ts: new Date().getTime(),
        api_vrsn: api_v,
        lng_vrsn: lng_v,
        status: {
            err_cd: err_code,
            err_msg_cd: err_msg
        }
    }
    const response = Object.assign(data, addtionaldata);

    return response
}

module.exports = {
    generateResponse
}
