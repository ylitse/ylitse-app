# Ylitse mobile application

## Development

Install dependencies:

```sh
npm install
```

Create a config file by copying local config example:

```sh
cp config.template.android.json config.json
```

You can edit the config file as suited:

| Parameter      | Description              |
| -------------- | ------------------------ |
| `baseUrl`      | Ylitse API base URL      |
| `loginUrl`     | Ylitse service login URL |
| `feedBackUrl`  | Feedback form URL        |
| `termsUrl`     | Terms and conditions URL |
| `userGuideUrl` | User's manual URL        |

After installation run metro package bundler:

```sh
npm start
```

To deploy the app on an android device run:

```sh
npm run android
```

Or on an iOS device (you have to use a MacBook for this):

```sh
npm run ios
```

### Running end-to-end tests

Run the steps described below in separate terminals.

1. Go to Ylitse API repo and start the backend locally (make sure `admin`
   user exists):

```sh
source env/bin/activate
make run-gunicorn
```

2. Start bundler:

```sh
make bundler
```

3. And finally run tests (make sure password matches the one configured for
   the local API):

```sh
YLITSE_API_PASS=random make e2e
```

By default emulator device name is `pixel`, but you can overwrite it like so:

```sh
YLITSE_DEVICE=pixel_xl YLITSE_API_PASS=random make e2e
```
