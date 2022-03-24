const fetch = require('node-fetch');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
};

exports.handler = async (event, context) => {
  // console.log(event);

  if (event.httpMethod === 'OPTIONS') {
    // console.log(event.headers);
    const respHeaders = {
      ...corsHeaders,
      'Access-Control-Allow-Headers':
        event.headers['access-control-request-headers'],
    };
    // console.log(respHeaders);

    return {
      statusCode: 200,
      headers: respHeaders,
    };
  }

  const { url } = event.queryStringParameters;

  const headers = { ...event.headers };
  ['host'].forEach((key) => delete headers[key]);
  // console.log(headers);

  try {
    const init = {
      headers,
      method: event.httpMethod,
      body: ['POST', 'PUT', 'PATCH'].includes(event.httpMethod)
        ? event.body
        : undefined,
    };
    // console.log(init);
    const response = await fetch(url, init);
    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        ...response.headers,
      },
      body: data,
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};
