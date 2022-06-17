# My custom COGS Media Master content

This is a [`create-react-app`](https://create-react-app.dev) Typescript project that connects to [COGS](https://cogs.show) using [`@clockworkdog/cogs-client-react`](https://www.npmjs.com/package/@clockworkdog/cogs-client-react).

## Local development in a browser

```
yarn start "My custom Media Master"
```

This will connect to COGS as a simulator for the Media Master called "My custom Media Master".

## Build for your COGS project

```
yarn build
```

The `build` directory can now be used by COGS as custom Media Master content.

You can place this entire project in your COGS project's `client_content` directory or, once built, you can copy the `build` directory to your COGS project's `client_content` directory. Select the built directory/subdirectory from COGS as your custom Media Master's "Content directory".

![Screenshot from 2021-10-01 09-31-04](https://user-images.githubusercontent.com/292958/135590011-c3d30df6-5590-4a44-8160-f31e3cd4008e.png)
