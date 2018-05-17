import request from 'request-promise';
import pathToRegexp from 'path-to-regexp';

function replacePathParams(path, params) {
    const keys = [];
    // we don't care about the regexp, just extract the keys
    pathToRegexp(path, keys);

    keys.forEach(k => {
        if (params[k.name]) {
            path = path.replace(':' + k.name, params[k.name]);
        }
    });

    return path;
}

const hasColons = /:/;

export default function proxy(ctx,next,path,options) {
    return new Promise((resolve,reject)=>{
      const shouldReplacePathParams = hasColons.test(path);
          const requestOpts = {
              url: options.host + (path || ctx.url),
              method: ctx.method,
              headers:ctx.headers,
              qs: ctx.query,
              resolveWithFullResponse: true
          };
          

          // if we have dynamic segments in the url
          if (shouldReplacePathParams) {
              requestOpts.url = options.host + replacePathParams(path, ctx.params);
          }

          // something possibly went wrong if they have no body but are sending a
          // put or a post
          if (requestOpts.method === 'POST' || requestOpts.method === 'PUT') {

              if (!ctx.request.body) {
                  console.warn('sending PUT or POST but no request body found');
              } else {
                  requestOpts.body = ctx.request.body;
              }

              // make request allow js objects if we are sending json
              if (ctx.request.type === 'application/json') {
                  requestOpts.json = true;
              }
          }

      console.log(requestOpts)
          request(requestOpts)
              .then(response => {
                  resolve(response)

                  // Proxy over response headers
                  // Object.keys(response.headers).forEach(
                  //     h => ctx.set(h, response.headers[h])
                  // );
                  //
                  // ctx.status = response.statusCode;
                  // ctx.body = response.body;
                  //
                  // return next();
              })
              .catch(err => {
                  reject(err)
                  // ctx.body = err.reason;
                  // ctx.status = err.statusCode || 500;
              });
    })

};
