import fetch from "cross-fetch"

const fetchData = async (query: any, variables: any) => {
  const data = await fetch(process.env.GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  })
  return data
}

async function getData(query: any, variables: any) {
  const data = await fetchData(query, variables).then(async (response) => {
    if (response.ok) {
      const json = await response.json()
      if (json.error) {
        throw new Error(json.error.message)
      }
      if (json.data) {
        return json.data
      }
    }
  })
  return data
}

export default getData
