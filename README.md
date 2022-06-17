# COGS <-> Buzzshot groups plugin

This plugin is a work in progress.

## Local development in a browser

```
yarn start "My Test Media Master Name"
```

This will connect to COGS as a simulator for the Media Master called "My Test Media Master Name".

## Build for your COGS project

```
yarn build
```

The `build` directory can now be used by COGS as custom Media Master content.

You can place this entire project in your COGS project's `client_content` directory or, once built, you can copy the `build` directory to your COGS project's `client_content` directory. Select the built directory/subdirectory from COGS as your custom Media Master's "Content directory".

![Screenshot from 2021-10-01 09-31-04](https://user-images.githubusercontent.com/292958/135590011-c3d30df6-5590-4a44-8160-f31e3cd4008e.png)
