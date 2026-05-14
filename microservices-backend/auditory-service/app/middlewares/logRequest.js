const logRequest = (req, res, next) => {
  const start = Date.now();
  const { method, url, headers, body, query } = req;

  // Para capturar el body de la respuesta
  const oldSend = res.send;
  let responseBody;
  res.send = function (data) {
    responseBody = data;
    return oldSend.apply(res, arguments);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logInfo = {
      timeStamp: new Date().toISOString(),
      method,
      url,
      // headers,
      // query,
      // body,
      status: res.statusCode,
      // response: responseBody,
      response_time: duration + "ms",
    };
    console.log(JSON.stringify(logInfo));
  });

  next();
};

export default logRequest;