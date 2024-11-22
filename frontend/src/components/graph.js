export const callMsGraph = async (accessToken, endpoint) => {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  const response = await fetch(
    `https://graph.microsoft.com/v1.0${endpoint}`,
    options
  );
  const data = await response.json();
  return data;
};
