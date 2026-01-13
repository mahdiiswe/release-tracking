import axios from 'axios';

const RELEASE_API_BASE_URL = "http://localhost:8081/get_release";

export const getReleases = () => axios.get(RELEASE_API_BASE_URL);
//export const getReleases = () => axios.get("http://localhost:8081/get_release");

export const addRelease = (release) => axios.post("http://localhost:8081/add", release);
//export const addRelease = (release) => axios.post(RELEASE_API_BASE_URL, release);

export const getRelease = (releaseId) => axios.get(RELEASE_API_BASE_URL + '/' + releaseId);

export const updateRelease = (releaseId, release) => axios.put(RELEASE_API_BASE_URL + '/' + releaseId, release);

export const delRelease = (releaseId) => axios.delete(RELEASE_API_BASE_URL + '/' + releaseId);

