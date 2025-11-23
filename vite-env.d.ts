// Cannot find type definition file for 'vite/client', so we define the necessary environment types manually.
declare const process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};
