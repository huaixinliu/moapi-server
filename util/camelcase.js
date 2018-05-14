
export function _ToCamelcase(json){
  let jsonStr=JSON.stringify(json);
  return JSON.parse(jsonStr.replace(/[{,]"[^_:]+(_[^_:][^_:]*)+":/gm,function($){
    return $.replace(/_(.)/g,function($$,$$1){
      return $$1.toUpperCase()
    })
  }))
}

export function camelcaseTo_(json){
  let jsonStr=JSON.stringify(json);
  return JSON.parse(jsonStr.replace(/[{,]"[^A-Z:]+([A-Z][^A-Z:]*)+":/gm,function($){
    return $.replace(/([A-Z])/g,function($$,$$1){
      return "_"+$$1.toLowerCase()
    })
  }))
}
