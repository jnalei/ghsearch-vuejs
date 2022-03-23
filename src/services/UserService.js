import axios from "axios";

// single axios instance for entire app
const apiCall = axios.create({
  baseURL: "https://api.github.com",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  getUsers() {
    return apiCall.get("/users");
  }
};
