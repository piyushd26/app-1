import {TIP_TRACK, ALLOW_NEXT_TIP} from '../constants/Actions';
import {TIP_TIMEOUT_MILIS} from '../constants/App';
import {fetchPostFormDataJson} from '../tools/util';
import {addAlert} from './alert';
import NavigationService from '../services/NavigationService';

function addTip(track, json) {
  return function(dispatch, getState) {
    let success = false;
    if (json.tx) {
      dispatch(addAlert('success', 'Your tip has been sent successfully!', 'Thanks for supporting your favorite artists.'));
      success = true;
    } else {
      dispatch(addAlert('error', 'Something went wrong', 'Please retry your tip at a later time.'));
    }
    dispatch({
      type: TIP_TRACK,
      trackAddress: track.trackAddress,
      track,
      success,
    });
  };
}

async function tipTrackJson(trackAddress, token, email) {
  let params = {
    trackAddress,
    musicoins: 1,
  };

  let tipTrack = await fetchPostFormDataJson(`v1/release/tip?email=${email}&accessToken=${token}`, params);
  return tipTrack;
}

export function tipTrack(track) {
  return function(dispatch, getState) {
    let {loggedIn} = getState().auth;
    if (loggedIn) {
      let {accessToken, email} = getState().auth;
      return tipTrackJson(track.trackAddress, accessToken, email).then(json => dispatch(addTip(track, json)));
    } else {
      NavigationService.navigate('Profile');
    }
  };
}
