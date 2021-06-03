import https from 'https';
import { spawn } from 'child_process';
import moment from 'moment';
import lodash from 'lodash';
import {
    states,
    specificDistrict,
    minAge,
    vaccineType,
    available_capacity_dose_X,
    loopCheckingInterval,
    pathForWarningFile,
    AudioOrVideoPlayer,
} from './constants.mjs';

const hostname = 'cdn-api.co-vin.in';
const getSlotDetails = '/api/v2/appointment/sessions/public/calendarByDistrict?district_id={{district_id}}&date={{date}}';
let watchingStates = undefined; //  { ALL | FEW }
let isAlarmActive = false;

function triggerAlarm() {
    if (!isAlarmActive) {
        console.log('Found slots for ' + minAge + '+');
        isAlarmActive = true;
        spawn(AudioOrVideoPlayer, [pathForWarningFile]);
    }
    return '';
}

async function fetchSlotDetails(district_id, date, place) {
    const options = {
        hostname,
        port: 443,
        path: getSlotDetails
                .replace('{{district_id}}', district_id)
                .replace('{{date}}', date),
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return new Promise(res => {
        https
            .get(options, function (response) {
                let data = '';
    
                response.on('data', function (chunk) {
                    data += chunk;
                });
    
                response.on('close', () => {
                    if (response.statusCode === 200) {
                        try {
                            data = JSON.parse(data);
                            
                            const result = data.centers
                                .filter(element => element
                                    .sessions
                                    .filter(session => (
                                        session.min_age_limit === minAge &&
                                        (session[available_capacity_dose_X] > 0) &&
                                        (session.vaccine === vaccineType)
                                    )).length > 0)
                                .map((element) => {
                                    return  {
                                        sessions: element.sessions
                                                    .filter(session => (
                                                        session.min_age_limit === minAge &&
                                                        (session[available_capacity_dose_X] > 0) &&
                                                        (session.vaccine === vaccineType)
                                                    )),
                                        fee_type: element.fee_type,
                                        from: element.from,
                                        to: element.to,
                                        name: element.name,
                                        address: `${element.address} ${element.block_name} ${element.district_name} ${element.state_name}`,
                                        district_name: element.district_name,
                                        pincode: element.pincode,
                                    };
                                });

                            if (result.length > 0) {
                                let sum = 0;
                                result.forEach(e => e.sessions.forEach(k => sum+=k[available_capacity_dose_X]));
                                console.log(`Receiving SOME from ${place} --------> ${sum} Count(s)`);
                                triggerAlarm();
                                res(result);
                            } else {
                                console.log('Receiving NUll from', place);
                                res(null);
                            }
                        } catch (error) {
                            console.error('Parsing data Exception', error);
                            res(null);
                        }
                    } else {
                        console.log('Receiving Non 200 response ', response.statusCode)
                        res(null);
                    }
                });
    
            });
    });
}


async function main() {
    const date = moment().format('D/M/yyyy');
    let statesClone;

    switch (watchingStates) {
        case 'ALL': {
            statesClone = lodash.cloneDeep(states);
            break;
        }
        case 'FEW': 
        default: {
            statesClone = lodash.cloneDeep(specificDistrict);
            break;
        }
    }
    
    for (let state of statesClone){
            for(let districtDetail of state.districtDetails) {
                    districtDetail.slotDetails = await fetchSlotDetails(districtDetail.district_id, date, `${districtDetail.district_name}, ${state.state_name}`);
                    districtDetail = districtDetail.slotDetails ? districtDetail : null;
                }
                state.districtDetails = state.districtDetails.filter(districtDetail => districtDetail.slotDetails);
            }
    console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv')
    console.log(JSON.stringify(statesClone.filter(e => e.districtDetails.length), null, '  '));
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
}

async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}

async function loop()  {
    if (!watchingStates) {
        watchingStates = process.argv.slice(2) &&
                    process.argv.slice(2).length 
                    ? process.argv.slice(2)[0]
                    : 'FEW';
    }

    console.log('Checking for slots at ', new Date());
    await main();
    await sleep(loopCheckingInterval);
    await loop();
}


loop();
