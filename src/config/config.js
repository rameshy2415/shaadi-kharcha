const config = {
    BACKEND_API: import.meta.env.VITE_BACKEND_API || "http://localhost:5000/api",
    ENV: import.meta.env.VITE_ENV || "local",
  };
  
  export default config;