import axios, {
  AxiosError,
  AxiosResponse,
} from "axios";

export const httpRequest = axios.create({
  withCredentials: true,
  baseURL: "/api",
});
httpRequest.interceptors.request.use( (config)=> {
    return config;
  }, (error)=> {
    return Promise.reject(error);
  });
httpRequest.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response?.request["path"] === "/api/auth/login") {
        httpRequest.defaults.headers.common = {
            ...httpRequest.defaults.headers.common,
            ...response.headers,
          };
    }
    if(response.data['payload'])
    return response.data['payload'];
    return response.data
  },
  (error: AxiosError) => {
    const errorMessage = {
      statusCode: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      errorResponse: error.response?.data,
    };
    return Promise.reject(errorMessage);
  }
);

