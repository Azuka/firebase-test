# firebase-test

Sample repository to test writing a NodeJS API that connects to Firebase in TypeScript.

This uses:

- [tsoa](https://github.com/lukeautry/tsoa) for OpenAPI generation 
- [StackDriver](https://cloud.google.com/nodejs/docs/stackdriver) for error reporting / tracing


## Running

```shell
npm ci
npm run dev
```

Visit:

- http://localhost:3000/redoc
- http://localhost:3000/docs
- http://localhost:3000/todos/abc
- http://localhost:3000/hello/world
