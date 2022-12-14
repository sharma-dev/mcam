import axios from "axios";
import { API_URL } from "../../utils/config";


export const createTrip = (tripName, token) => {
        let url = `${API_URL}trips`;
        return axios({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: {
                "name": tripName
            }
        });
}

export const updateTrip = (tripName, data, token) => {
    let url = `${API_URL}trips`;
    return axios({
        method: "PUT",
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: {
            "tripName": tripName,
            "data": data
        }
    });
}

export const getTrips = (tripName, token) => {
    let url = `${API_URL}trips`;
    return axios({
        method: "GET",
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        query: {
            "tripName": tripName,
        }
    });
}


export const getUserTrips = (token) => {
    let url = `${API_URL}getUserTrips`;
    return axios({
        method: "GET",
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
}

export const deleteTrip = (id, token) => {
    let url = `${API_URL}trips`;
    return axios({
        method: "DELETE",
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: {
            "group_id": id
        }
    });
}

export const markTripActive = (trip, token) => {
    let url = `${API_URL}trips/mark_active?n=${trip}`;
    return axios({
        method: "GET",
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
}


export const shareNewImage = (data, token) => {
    let url = `${API_URL}newImage`;
    return axios({
        method: "POST",
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: data
    });
} 

export const manageMembersToGroup = ({groupName, member, addMember, groupId}, token) => {
    let url = `${API_URL}manageMembersToGroup`;
    return axios({
        method: "POST",
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: {
            "groupName": groupName,
            "member": member,
            "operation": addMember ? "add" : "remove",
            "groupId": groupId
        }
    });
}